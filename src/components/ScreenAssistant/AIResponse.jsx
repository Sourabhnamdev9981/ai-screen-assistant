export default function AIResponse({ result, aiResponse }) {
  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">📄 OCR Result</h2>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result?.text || "No result yet."}</pre>

      <h2 className="text-lg font-semibold mt-4 mb-2">🤖 AI Suggestion</h2>
      <p className="text-sm text-gray-800">{aiResponse || "No AI response yet."}</p>
    </div>
  );
}
