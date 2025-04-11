import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import { AuthProvider } from './context/AuthContext';
import RouterLayout from "./routes/RouterLayout";
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;