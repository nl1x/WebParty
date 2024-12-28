import Background from "./components/background/background.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginView from "@views/login/login-view";
import {NavigatorProvider} from "@hooks/navigator/navigator-provider.tsx";
import {AuthProvider} from "@hooks/auth/auth-provider.tsx";
import ProtectedRoute from "@components/protected-route/protected-route.tsx";
import HomeView from "@views/home/home-view.tsx";
import LogoutView from "@views/logout/logout-view.tsx";
import {PATH} from "@path/path.tsx";
import CameraView from "@views/camera/camera-view.tsx";

function App() {

  return (
    <Background>
      <BrowserRouter>
        <NavigatorProvider>
          <AuthProvider>
            <Routes>
              <Route path="/">
                <Route index element={<LoginView />}/>
                <Route path={PATH.LOGIN} element={<LoginView />}/>
                <Route path={PATH.LOGOUT} element={<LogoutView />}/>
                <Route path={PATH.HOME} element={
                  <ProtectedRoute redirect={PATH.LOGIN}>
                    <HomeView />
                  </ProtectedRoute>
                }/>
                <Route path={PATH.CAMERA} element={
                  <ProtectedRoute redirect={PATH.LOGIN}>
                    <CameraView />
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
