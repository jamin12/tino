import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "@shared/ui/layouts";
import { HomePage } from "@pages/home";
import { NewDocumentPage } from "@pages/new";
import { DocumentPage } from "@pages/document";
import { PresentPage } from "@pages/present";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewDocumentPage />} />
          <Route path="/document/:id" element={<DocumentPage />} />
        </Route>
        <Route path="/document/:id/present" element={<PresentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
