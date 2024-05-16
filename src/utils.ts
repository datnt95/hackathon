export function formatHTML(template: string, data: any): string {
  let result = template;
  for (const key in data) {
    const value = data[key];
    const reg = new RegExp(`##${key}##`, "g");
    result = result.replace(reg, value);
  }
  return result;
}

export function transformStringToJSON(value: string) {
  if (value) {
    const regex = /```json([\s\S]*?)```/;
    let expectedJson = null;
    let match = value.match(regex);

    if (match && match.length > 1) {
      const jsonContent = match[1];
      expectedJson = match[1];
    } else {
      console.log("No JSON content found.");
    }
    if (value.startsWith("{")) {
      expectedJson = value;
    }
    const cleanedJsonString = (expectedJson ?? "")
      .replace(/^```json/, "") // Remove opening code block marker
      .replace(/```$/, "") // Remove closing code block marker
      .replace(/\\n/g, "") // Remove line breaks
      .replace(/\n/g, ""); // Remove line breaks

    // Parse the cleaned JSON string into a JavaScript object
    try {
      const jsonObject = JSON.parse(cleanedJsonString);

      return jsonObject || {};
    } catch (error) {
      console.error("Error parsing JSON:", error);

      return {};
    }
  }

  return {};
}
