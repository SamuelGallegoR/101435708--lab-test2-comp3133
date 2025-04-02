import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { SpacexService } from '../../services/spacex.service';
import { Mission } from '../../models/mission';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [CommonModule, MatCardModule, HttpClientModule, FormsModule],
  templateUrl: './missionlist.component.html',
  styleUrls: ['./missionlist.component.css']
})
export class MissionlistComponent implements OnInit {

  missions: Mission[] = [];
  years: string[] = [];

  year: string = '';
  launchSuccess: string = '';
  landingSuccess: string = '';
  searchTerm: string = '';

  constructor(private spacexService: SpacexService) { }

  ngOnInit(): void {
    this.spacexService.getMissions().subscribe(data => {
      this.missions = data;
      this.years = [...new Set(data.map(m => m.launch_year))].sort();
    });
  }

  getFilteredMissions(): Mission[] {
    return this.missions.filter(mission => {
      const matchesYear = this.year ? mission.launch_year === this.year : true;
      const matchesLaunchSuccess = this.launchSuccess 
        ? (this.launchSuccess === 'success' ? mission.launch_success === true : mission.launch_success === false)
        : true;
      const matchesLandingSuccess = this.landingSuccess
        ? (this.landingSuccess === 'success' ? mission.rocket.first_stage.cores.some(core => core.land_success === true) : mission.rocket.first_stage.cores.some(core => core.land_success === false))
        : true;
      const matchesSearch = this.searchTerm ? mission.mission_name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      return matchesYear && matchesLaunchSuccess && matchesLandingSuccess && matchesSearch;
    });
  }

  resetFilters(): void {
    this.year = '';
    this.launchSuccess = '';
    this.landingSuccess = '';
    this.searchTerm = '';
  }
}
