export async function getIssuesNumber(): Promise<number> {
    "use server";
    if (!process.env.LUNNI_SERVICES) {
      console.error("LUNNI_SERVICES environment variable is not set");
      return 0;
    }
  
    try {
      const response = await fetch(`${process.env.LUNNI_SERVICES}`, {
        method: "GET",
        // cache: "no-store",
        headers: {
          Authorization: `Bearer ${process.env.LUNNI_API}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 600 },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch issues");
        return 0;
      }
      const data = await response.json();
      return Array.isArray(data) ? data.length : 0; // Varmista, että data on taulukko
    } catch (error) {
      console.error("Error fetching issues:", error);
      return 0;
    }
  }