import Background from "./components/background/background";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginView from "@views/login/login-view";
import {NavigatorProvider} from "@hooks/navigator/navigator-provider";
import {AuthProvider} from "@hooks/auth/auth-provider";
import ProtectedRoute from "@components/protected-route/protected-route";
import HomeView from "@views/home/home-view";
import LogoutView from "@views/logout/logout-view";
import {PATH} from "@path/path";
import CameraView from "@views/camera/camera-view";
import {ROLE} from "@config/variables.ts";
import AdminView from "@views/admin/admin-view.tsx";
import Redirect from "@components/redirect/redirect.tsx";
import NotFoundView from "@views/not-found/not-found-view.tsx";
import HistoryView from "@views/history/history-view.tsx";
import AccountView from "@views/account/account-view.tsx";
import RankView from "@views/rank/rank-view.tsx";

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
                <Route path={PATH.RANK} element={
                  <ProtectedRoute redirect={PATH.LOGIN}>
                    <RankView />
                  </ProtectedRoute>
                }/>
                <Route path={PATH.HISTORY} element={
                  <ProtectedRoute redirect={PATH.LOGIN}>
                    <HistoryView />
                  </ProtectedRoute>
                }/>
                <Route path={PATH.ACCOUNT} element={
                  <ProtectedRoute redirect={PATH.LOGIN}>
                    <AccountView />
                  </ProtectedRoute>
                }/>
                <Route path={PATH.ADMIN} element={
                  <ProtectedRoute redirect={PATH.NOT_FOUND} requiredRole={ROLE.ORGANISER}>
                    <AdminView />
                  </ProtectedRoute>
                }/>
                <Route path="*" element={<Redirect to={PATH.NOT_FOUND}/>}/>
                <Route path={PATH.NOT_FOUND} element={<NotFoundView/>}/>
              </Route>
            </Routes>
          </AuthProvider>
        </NavigatorProvider>
      </BrowserRouter>
    </Background>
  )
}

export default App
