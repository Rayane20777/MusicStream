import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>MusicStream</h1>
      </div>
      <ul class="navbar-links">
  <li><a href="/">Home</a></li>
  <li><a href="/library">Library</a></li>
  <li><a href="/manage">Manage Tracks</a></li>
</ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #4CAF50;
      padding: 10px 20px;
      color: white;
    }
    .navbar-brand h1 {
      margin: 0;
    }
    .navbar-links {
      list-style: none;
      display: flex;
      gap: 20px;
    }
    .navbar-links li a {
      color: white;
      text-decoration: none;
      font-weight: bold;
    }
    .navbar-links li a:hover {
      text-decoration: underline;
    }
  `]
})
export class NavbarComponent {}
