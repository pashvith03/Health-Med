import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { FeaturesComponent } from './components/features/features.component';
import { CareunitComponent } from './components/admin/careunit/careunit.component';
import { BedsComponent } from './components/admin/beds/beds.component';
import { StafComponent } from './components/staff/staff.component';
import { FluidsComponent } from './components/admin/fluids/fluids.component';
import { MedicationsComponent } from './components/admin/medications/medications.component';
import { HospitalComponent } from './components/admin/hospital/hospital.component';
import { routeGaurdGuard } from './routegaurds/route-gaurd.guard';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { UserStaffComponent } from './components/user/user-staff/user-staff.component';
import { UserMedicationsComponent } from './components/user/user-medications/user-medications.component';
import { UserfluidsComponent } from './components/user/userfluids/userfluids.component';
import { PatientFinalReportComponent } from './components/user/patient-final-report/patient-final-report.component';
import { OtNotesComponent } from './components/user/ot-notes/ot-notes.component';
import { UserFlowSheetComponent } from './components/user/user-flow-sheet/user-flow-sheet.component';
import { AdmitPatientComponent } from './components/user/admit-patient/admit-patient.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'registration', component: RegistrationComponent },
  {
    path: 'features',
    component: FeaturesComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'careunit',
    component: CareunitComponent,
    canActivate: [routeGaurdGuard],
  },
  { path: 'beds', component: BedsComponent, canActivate: [routeGaurdGuard] },
  { path: 'staff', component: StafComponent, canActivate: [routeGaurdGuard] },
  {
    path: 'fluids',
    component: FluidsComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'medications',
    component: MedicationsComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'hospital',
    component: HospitalComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'userstaff',
    component: UserStaffComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'usermedications',
    component: UserMedicationsComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'userfluids',
    component: UserfluidsComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'finalreport',
    component: PatientFinalReportComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'otnotes',
    component: OtNotesComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'userflowsheet',
    component: UserFlowSheetComponent,
    canActivate: [routeGaurdGuard],
  },
  {
    path: 'admitpatient',
    component: AdmitPatientComponent,
    canActivate: [routeGaurdGuard],
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
