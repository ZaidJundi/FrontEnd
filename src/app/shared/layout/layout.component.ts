import { Component, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  mobileQuery: MediaQueryList;
  public name!: string;
  notifications: string[] = [];
  private _mobileQueryListener: () => void;

  constructor(
    private mediaMatcher: MediaMatcher,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private userStore: UserStoreService,
    private http: HttpClient,
  private api: ApiService
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.cdr.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.userStore.getFullNameFromStore().subscribe(val => {
      const roleFromToken = this.auth.getfullNameFromToken();
      this.name = val || roleFromToken;
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "تسجيل الخروج",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، سجل الخروج!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.signOut(); // تنفيذ عملية تسجيل الخروج
        Swal.fire(
          'تم تسجيل الخروج!',
          'لقد تم تسجيل الخروج بنجاح.',
          'success'
        );
      }
    });
  }

  get notificationsCount(): number {
    return this.notifications.length;
  }

  loadNotifications() {
    this.api.getNotifications().subscribe(
      (data: any[]) => {
        this.notifications = data.map(item => item.message);
      },
      (error) => {
        console.error('Failed to load notifications', error);
      }
    );
  }



}
