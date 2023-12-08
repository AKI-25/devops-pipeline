import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { RomeCardComponent } from './rome-card/rome-card.component';
import { AthenaCardComponent } from './athena-card/athena-card.component';
import { SocketService } from './socket.service';
import { isPlatformServer } from '@angular/common';
const SERVER_DATA_KEY = makeStateKey('serverData');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    NavbarComponent,
    RomeCardComponent,
    AthenaCardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{
  serverData: any;
  newVote: any;
  title = 'result-ui';
  separatorWidth=8.5;
  firstArtVotes= 0;
  secondArtVotes= 0;
  totalCount= 0;
  initialSeparatorOffset= 50 - (this.separatorWidth/2);
  normalizingFactor= 0;
  separatorOffset= this.initialSeparatorOffset ;
  leftSectionWidth= 50 
  rightSectionWidth= 50 
  rightSectionScale = 1;
  leftSectionScale = 1;
  constructor(
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
    private readonly ngZone: NgZone
    ){
      
    }
  ngOnInit(): void {
    this.socketService.on$('voteUpdate').subscribe((message:any) => {
      this.ngZone.run(() =>{
        if( this.newVote !== JSON.parse(message) ){
          this.newVote = JSON.parse(message);
          this.updateVote(this.newVote["art1"],this.newVote["art2"]);
        }
    });
  });

  }
  updateVote(newArtOneVote: number, newArtTwoVote: number){
    this.firstArtVotes = newArtOneVote;
    this.secondArtVotes = newArtTwoVote;
    this.totalCount= this.firstArtVotes + this.secondArtVotes;
    this.normalizingFactor= (this.firstArtVotes - this.secondArtVotes)/ this.totalCount;
    this.separatorOffset= this.initialSeparatorOffset + Math.min((15 * this.normalizingFactor),15);
    this.leftSectionWidth= 50 + Math.min((15 * this.normalizingFactor),15)
    this.rightSectionWidth= 50 - Math.min((15 * this.normalizingFactor),15)
    this.rightSectionScale = 1 - Math.min((0.2 * this.normalizingFactor),0.2);
    this.leftSectionScale = 1 + Math.min((0.2 * this.normalizingFactor),0.2);
    this.cdr.detectChanges();
  }



  // updateFirstArtVoteValue() {
  //   this.firstArtVotes += 1;
  //   this.totalCount= this.firstArtVotes + this.secondArtVotes;
  //   this.normalizingFactor= (this.firstArtVotes - this.secondArtVotes)/ this.totalCount;
  //   this.separatorOffset= this.initialSeparatorOffset + Math.min((15 * this.normalizingFactor),15);
  //   this.leftSectionWidth= 50 + Math.min((15 * this.normalizingFactor),15)
  //   this.rightSectionWidth= 50 - Math.min((15 * this.normalizingFactor),15)
  //   this.rightSectionScale = 1 - Math.min((0.2 * this.normalizingFactor),0.2);
  //   this.leftSectionScale = 1 + Math.min((0.2 * this.normalizingFactor),0.2);
  //   this.cdr.detectChanges();
  // }
  // updateSecondArtVoteValue() {
  //   this.secondArtVotes += 1;
  //   this.totalCount= this.firstArtVotes + this.secondArtVotes;
  //   this.normalizingFactor= (this.firstArtVotes - this.secondArtVotes)/ this.totalCount;
  //   this.separatorOffset= this.initialSeparatorOffset + Math.min((15 * this.normalizingFactor),15);
  //   this.leftSectionWidth= 50 + Math.min((15 * this.normalizingFactor),15)
  //   this.rightSectionWidth= 50 - Math.min((15 * this.normalizingFactor),15)
  //   this.rightSectionScale = 1 - Math.min((0.2 * this.normalizingFactor),0.2);
  //   this.leftSectionScale = 1 + Math.min((0.2 * this.normalizingFactor),0.2);
  //   this.cdr.detectChanges();
  // }
}
