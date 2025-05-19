import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

        const url = "/amar_vaghela_final_report.pdf";
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        const container = document.getElementById("pdf-container");
        if (!container) return;

        // Clear previous content
        container.innerHTML = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          
          if (!context) {
            console.error("Canvas context not available");
            continue;
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.marginBottom = "20px";

          try {
            await page.render({
              canvasContext: context,
              viewport
            }).promise;
            
            container.appendChild(canvas);
          } catch (error) {
            console.error(`Error rendering page ${pageNumber}:`, error);
          }
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();

    const disableContext = (e: MouseEvent) => e.preventDefault();
    const disableKeys = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        ["p", "s", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableContext);
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.removeEventListener("contextmenu", disableContext);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  return (
    <>
      <Head>
        <title>PDF Viewer</title>
        <meta name="description" content="Simple PDF viewer using Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#fff",
      }}>
        <h1 style={{
          marginBottom: "2rem",
          color: "#333",
          textAlign: "center"
        }}>
          Thesis-PDF by Rahul Panchal
        </h1>
        <div 
          id="pdf-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        />
      </main>
    </>
  );
}