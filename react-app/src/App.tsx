import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '@/pages/Home';
import React, { useContext } from 'react';
import '@/App.css';
import { ThemeProvider } from '@emotion/react';
import appTheme from './themes/appTheme';
import Dev from './pages/DevZone';
import { ConfigContextProvider } from './contexts/configContext';
import AuthContextProvider, { AuthContext } from './contexts/authContext';
import AuthRouteGuard from './guards/AuthRouteGuard';
import BaseLayout from './components/layout/BaseLayout';
import { AccessRequest } from './pages/AccessRequest';
import UsersManagement from './pages/UsersManagement';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/pages/ErrorFallback';
import UserDetail from '@/components/users/UserDetail';
import ActiveInventory from './pages/ActiveInventory';
import PropertyDetail from './components/property/PropertyDetail';
import AddProperty from './components/property/AddProperty';
import AgencyManagement from '@/pages/AgencyManagement';
import AgencyDetail from '@/components/agencies/AgencyDetails';
import AddAgency from '@/components/agencies/AddAgency';
import AdminAreasManagement from './pages/AdminAreasManagement';
import AddAdministrativeArea from './components/adminAreas/AddAdministrativeArea';
import AdministrativeAreaDetail from './components/adminAreas/AdministrativeAreaDetail';
import ProjectManagement from './pages/ProjectManagement';
import AddProject from '@/components/projects/AddProject';
import { Roles } from '@/constants/roles';
import ProjectDetail from '@/components/projects/ProjectDetail';
import SnackBarContextProvider from './contexts/snackbarContext';
import ParcelMap from '@/components/map/ParcelMap';
import LookupContextProvider from '@/contexts/lookupContext';
import BulkUpload from './pages/BulkUpload';

const Router = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  // Reusable piece to show map on many routes
  const showMap = () => (
    <BaseLayout>
      <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
        <ParcelMap
          height="100%"
          loadProperties={true}
          popupSize="large"
          scrollOnClick
          hideControls
        />
      </AuthRouteGuard>
    </BaseLayout>
  );

  return (
    <Routes>
      <Route
        index
        element={
          auth.keycloak.isAuthenticated && auth.pimsUser.data?.Status === 'Active' ? (
            showMap()
          ) : (
            <BaseLayout displayFooter>
              <Home />
            </BaseLayout>
          )
        }
      />
      <Route
        path="/access-request"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard ignoreStatus>
              <AccessRequest />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route path="/admin">
        <Route
          path="bulk"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN]}>
                <BulkUpload />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="adminAreas"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR]}>
                <AdminAreasManagement />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="adminAreas/:id"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR]}>
                <AdministrativeAreaDetail />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="adminAreas/add"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR]}>
                <AddAdministrativeArea />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="agencies"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR]}>
                <AgencyManagement />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="agencies/:id"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR]}>
                <AgencyDetail onClose={() => navigate('/admin/agencies')} />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="agencies/add"
          element={
            <BaseLayout>
              <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR]}>
                <AddAgency />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
      </Route>
      <Route
        path="properties"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <ActiveInventory />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="users"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <UsersManagement />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="properties/add"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <AddProperty />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="properties/building/:buildingId"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <PropertyDetail onClose={() => navigate('/properties/')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="properties/parcel/:parcelId"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <PropertyDetail onClose={() => navigate('/properties/')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="users/:id"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <UserDetail onClose={() => navigate('/users')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="projects"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <ProjectManagement />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="projects/add"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <AddProject />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <ProjectDetail onClose={() => navigate('/projects')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route path="/map" element={showMap()} />
      <Route
        path="/dev"
        element={
          <BaseLayout>
            <AuthRouteGuard permittedRoles={[Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER]}>
              <Dev />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <ConfigContextProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthContextProvider>
            <LookupContextProvider>
              <SnackBarContextProvider>
                <Router />
              </SnackBarContextProvider>
            </LookupContextProvider>
          </AuthContextProvider>
        </ErrorBoundary>
      </ConfigContextProvider>
    </ThemeProvider>
  );
};

export default App;
