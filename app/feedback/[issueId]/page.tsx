import FeedbackForm from "@/components/feedback/feedback-form";
import { fetchIssueInstruction } from "@/lib/dataFetching";

export const dynamic = "force-dynamic";

export default async function FeedbackPage({
  params,
}: {
  params: { issueId: string };
}) {
  const instruction = await fetchIssueInstruction(params.issueId);

  if (!instruction) {
    return <div>Virhe: Vikailmoitusta ei löytynyt.</div>;
  }

  return (
    <div className="mt-20 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">
          Palautetta vikailmoitukselle id {params.issueId}
        </h1>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">AI huolto-ohjeet:</h2>
          <p>{instruction}</p>
        </div>
        <FeedbackForm issueId={params.issueId} instruction={instruction} />
      </div>
    </div>
  );
}
