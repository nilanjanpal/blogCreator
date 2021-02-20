import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authStatus: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatus = this.authService.getAuthStatus();
    this.authService.getAuthStatusEvent().subscribe(
      authStatus => this.authStatus = authStatus.authStatus
    );
  }

  onLogout() {
    this.authService.logout();
  }

}
