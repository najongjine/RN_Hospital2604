const HONO_SERVER_API = process.env.EXPO_PUBLIC_HONO_SERVER_API;
const POLLINATION_API_KEY = process.env.EXPO_PUBLIC_POLLINATION_API_KEY;
const POLLINATION_ENDPOINT = "https://gen.pollinations.ai/v1/chat/completions";
const MODEL_NAME = "openai-fast";

export const MEDICAL_CATEGORIES = [
  "내과",
  "정형외과",
  "이비인후과",
  "한의원",
  "소아과",
  "피부과",
  "통증클리닉",
  "신경과",
  "안과",
  "한방병원",
  "치과",
  "종합병원",
  "일반의원",
  "성형외과",
  "동물병원",
];

/**
 * 단계 1: 사용자의 질문을 분석하여 적절한 진료 과목 카테고리를 분류합니다.
 */
export async function classifyMedicalCategories(
  userPrompt: string,
): Promise<string[]> {
  const systemPrompt = `당신은 의료 상담 보조 AI입니다. 사용자의 질문을 분석하여 다음 카테고리 목록 중 가장 적합한 카테고리들을 선택하세요.
카테고리 목록: [${MEDICAL_CATEGORIES.join(", ")}]
응답은 반드시 JSON 배열 형태의 문자열로만 하세요. 예: ["내과", "소아과"]`;

  try {
    const response = await fetch(POLLINATION_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POLLINATION_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const json = await response.json();
    const content = json.choices[0].message.content;

    // JSON 파싱 시도 (AI가 객체 형태로 보낼 수도 있으므로 배열 추출)
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed))
      return parsed.filter((item) => MEDICAL_CATEGORIES.includes(item));
    if (parsed.categories && Array.isArray(parsed.categories)) {
      return parsed.categories.filter((item) =>
        MEDICAL_CATEGORIES.includes(item),
      );
    }

    return [];
  } catch (error) {
    console.error("Category classification failed:", error);
    return [];
  }
}

/**
 * 단계 2: 분류된 카테고리들을 바탕으로 병원 정보를 가져와 중복을 제거합니다.
 */
export async function fetchHospitalsByCategories(
  categories: string[],
  x: number,
  y: number,
): Promise<any[]> {
  const allHospitalsMap = new Map<string, any>();

  for (const category of categories) {
    try {
      const response = await fetch(
        `${HONO_SERVER_API}/api/hospital?query=${encodeURIComponent(category)}&x=${x}&y=${y}`,
      );
      const json = await response.json();

      if (json.success && Array.isArray(json.data)) {
        json.data.forEach((hospital: any) => {
          // 병원 이름이나 ID를 키로 사용하여 중복 제거
          const key = hospital.id || hospital.name;
          if (key && !allHospitalsMap.has(key)) {
            allHospitalsMap.set(key, hospital);
          }
        });
      }
    } catch (error) {
      console.error(
        `Fetching hospitals for category ${category} failed:`,
        error,
      );
    }
  }

  return Array.from(allHospitalsMap.values());
}

/**
 * 단계 3: 사용자 질문과 병원 목록을 결합하여 최종 AI 추천 메시지를 생성합니다.
 */
export async function getFinalAIRecommendation(
  userPrompt: string,
  hospitals: any[],
): Promise<string> {
  const hospitalInfo = hospitals
    .map((h) => `- ${h.name} (${h.address}, ${h.distance}m)`)
    .join("\n");
  const systemPrompt = `당신은 병원 추천 전문가입니다. 사용자의 질문과 주변 병원 목록을 바탕으로 가장 적합한 병원을 추천해 주세요.
친절하고 전문적인 어조로 답변하세요. 병원 이름과 특징을 언급하며 추천 이유를 설명해 주세요.

주변 병원 목록:
${hospitalInfo}`;

  try {
    const response = await fetch(POLLINATION_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POLLINATION_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const json = await response.json();
    return json.choices[0].message.content;
  } catch (error) {
    console.error("Final AI recommendation failed:", error);
    return "병원 추천 결과를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

/**
 * 전체 프로세스 실행: 상담 및 병원 추천
 */
export async function recommendHospitalsAI(
  userPrompt: string,
  x: number,
  y: number,
): Promise<{ recommendation: string; hospitals: any[] }> {
  // 1. 카테고리 분류
  const categories = await classifyMedicalCategories(userPrompt);

  // 만약 분류에 실패하거나 결과가 없으면 기본 '병원'으로 검색
  const searchCategories = categories.length > 0 ? categories : ["병원"];

  // 2. 병원 정보 가져오기
  const hospitals = await fetchHospitalsByCategories(searchCategories, x, y);

  // 3. 최종 추천 생성
  const recommendation = await getFinalAIRecommendation(userPrompt, hospitals);

  return {
    recommendation,
    hospitals,
  };
}
