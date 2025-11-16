export async function askAI(question: string) {
  try {
    const response = await fetch("https://NUME-appservice.azurewebsites.net/api/assistant/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    return data.response;
  } catch (err) {
    return "❌ Nu am putut contacta serverul. Verifică conexiunea sau încearcă din nou.";
  }
}
