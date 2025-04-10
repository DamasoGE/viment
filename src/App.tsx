import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AuthProvider } from './context/AuthContext';
import './App.css'

const App: React.FC = () => {
  return (
    
    <>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
    </>

  )
}



export default App;
