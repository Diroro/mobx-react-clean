import "reflect-metadata"; 
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AppComponent } from "./presentational/modules/app/app.component";
import { registerContainer } from "./DI/experiments/classes-di-container";
// import { app } from "./DI/di-container";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// app.runContainer();

// export const DependencyToken = app.DependencyToken;

registerContainer();

root.render(
    <AppComponent />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();