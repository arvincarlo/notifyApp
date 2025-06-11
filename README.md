# Wealth Management Portal

A wealth management portal built with React + TypeScript + Vite.

## Tech Stack

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Shadcn UI](https://ui.shadcn.com/) - Component Library
- [React Router](https://reactrouter.com/) - Routing
- React Context - State Management
- [TailwindCSS](https://tailwindcss.com/) - Styling Solution
- [SWC](https://swc.rs/) - Fast Refresh
- [html2canvas](https://html2canvas.hertzen.com/) - HTML to Canvas Rendering
- [jsPDF](https://github.com/MrRio/jsPDF) - PDF Generation
-  [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) - Microsoft Authentication
- [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react) - React Wrapper for MSAL

## Development Environment

- Node.js >= 16
- pnpm >= 8

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm run dev
```

### Generate Markdown project files structure
```bash
pnpm run generate-structure
```

## Project Structure
<!-- PROJECT_STRUCTURE_START -->
```
├── .scannerwork
│   └── report-task.txt
├── logs
├── public // Public assets directory
│   ├── images
│   │   ├── app-logo.svg
│   │   ├── bottom_logo.png
│   │   ├── csv.png
│   │   ├── empty_state_approvals.png
│   │   ├── empty_state_disclaim.png
│   │   ├── empty_state.png
│   │   ├── footer-logo.png
│   │   ├── header-bg.png
│   │   ├── header-logo.png
│   │   ├── login_left.png
│   │   ├── logo_sm.png
│   │   ├── logo.svg
│   │   ├── pdf.png
│   │   ├── react.svg
│   │   ├── report-logo.png
│   │   └── xls.png
│   └── vite.svg
├── scripts
│   └── generateStructure.mjs
├── src
│   ├── assets // Static assets
│   │   ├── fonts
│   │   │   ├── F37Hooj-Bold.otf
│   │   │   ├── F37Hooj-Bold.ttf
│   │   │   ├── F37Hooj-Regular.otf
│   │   │   └── F37Hooj-Regular.ttf
│   │   ├── assignment.svg
│   │   ├── chart.svg
│   │   ├── done.svg
│   │   ├── global.scss
│   │   ├── history.svg
│   │   ├── icon_eye_slash.svg
│   │   ├── icon_eye.svg
│   │   ├── settings.svg
│   │   └── tailwind.scss
│   ├── components // Components directory
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   └── toggle.tsx
│   │   ├── ActivityHistory.tsx
│   │   ├── ActivityHistoryItem.tsx
│   │   ├── Approvals.tsx
│   │   ├── columns.tsx
│   │   ├── custom-breadcrumb.tsx
│   │   ├── DatePicker.tsx
│   │   ├── DateRangePickerWithPresets.tsx
│   │   ├── DeleteDisclaimerDialog.tsx
│   │   ├── Deposits.css
│   │   ├── Deposits.tsx
│   │   ├── DisclaimDetail.tsx
│   │   ├── DisClaimer.tsx
│   │   ├── DisclaimerLoadingOverlay.tsx
│   │   ├── DisClaimerSearchBar.tsx
│   │   ├── DisClaimerTable.tsx
│   │   ├── DisclaimForm.tsx
│   │   ├── DisclaimOp.tsx
│   │   ├── Donut.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GlobalSkeleton.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoginForm.tsx
│   │   ├── LoginLoading.tsx
│   │   ├── MainLayout.tsx
│   │   ├── MonthSelector.tsx
│   │   ├── Navbar.tsx
│   │   ├── PdfFooter.css
│   │   ├── pdfFooter.tsx
│   │   ├── pdfHeader.css
│   │   ├── PdfHeader.tsx
│   │   ├── PdfSubTitle.tsx
│   │   ├── PdfTitle.tsx
│   │   ├── PreviewPdf.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── RadioButton.tsx
│   │   ├── ReportHeader.tsx
│   │   ├── Result.tsx
│   │   ├── ResultSkeleton.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchInput.tsx
│   │   ├── SideBar.tsx
│   │   ├── SideBarItem.tsx
│   │   ├── Summary.css
│   │   ├── summary.tsx
│   │   ├── TiptapEditor.tsx
│   │   ├── TrustPortfolioPdf.css
│   │   ├── TrustPortfolioPdf.tsx
│   │   └── UserSearchInput.tsx
│   ├── config
│   │   └── authConfig.ts
│   ├── constant
│   │   └── auth.ts
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── SearchContext.tsx
│   ├── hooks // Custom Hooks
│   │   ├── useAccounts.tsx
│   │   ├── useActivityHistory.tsx
│   │   ├── useAuth.tsx
│   │   ├── useExportPDF.tsx
│   │   └── useSearchAccounts.tsx
│   ├── lib
│   │   ├── axios.ts
│   │   ├── cookies.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   ├── pages // Page components
│   │   ├── Admin.tsx
│   │   ├── ApiRes.tsx
│   │   ├── Appendix.css
│   │   ├── Appendix.tsx
│   │   ├── Approval.tsx
│   │   ├── DisclaimerEdit.tsx
│   │   ├── Disclosure.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Parameter.tsx
│   │   ├── Report.tsx
│   │   ├── Report1.tsx
│   │   ├── Report10.tsx
│   │   ├── Report11.tsx
│   │   ├── Report12.tsx
│   │   ├── Report13.tsx
│   │   ├── Report14.tsx
│   │   ├── Report2.tsx
│   │   ├── Report3.tsx
│   │   ├── Report4.tsx
│   │   ├── Report5.tsx
│   │   ├── Report6.tsx
│   │   ├── Report7.tsx
│   │   ├── Report8.tsx
│   │   ├── Report9.tsx
│   │   ├── Test.tsx
│   │   └── useScrollSnap.ts
│   ├── providers
│   │   └── MsalAuthProvider.tsx
│   ├── routes
│   │   ├── config.tsx
│   │   └── RouterGenerator.tsx
│   ├── services // API services
│   │   ├── mockLoginApi.ts
│   │   ├── searchAccountsApi.ts
│   │   └── wealthService.ts
│   ├── test
│   ├── types // Type definitions
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md
├── sonar-project.properties
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
<!-- PROJECT_STRUCTURE_END -->

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
