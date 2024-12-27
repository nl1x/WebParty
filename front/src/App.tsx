import Background from "./components/background/background.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginView from "@views/login/login-view";
import {NavigatorProvider} from "@hooks/navigator/navigator-provider.tsx";
import {AuthProvider} from "@hooks/auth/auth-provider.tsx";
import ProtectedRoute from "@components/protected-route/protected-route.tsx";
import HomeView from "@views/home/home-view.tsx";

function App() {

  return (
    <Background>
      <BrowserRouter>
        <NavigatorProvider>
          <AuthProvider>
            <Routes>
              <Route path="/">
                <Route index element={<h1>Vite + React index</h1>}/>
                <Route path="login" element={<LoginView />}/>
                <Route path="home" element={
                  <ProtectedRoute redirect='/login'>
                    <HomeView />
                  </ProtectedRoute>
                }/>
                <Route path="*" element={<h1>Vite + React /*</h1>}/>
              </Route>
            </Routes>
          </AuthProvider>
        </NavigatorProvider>
      </BrowserRouter>
    </Background>
  )
}

export default App
