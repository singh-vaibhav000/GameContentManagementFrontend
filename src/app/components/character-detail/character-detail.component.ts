import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameCharacter } from '../../models/game-character';
import { CharacterService } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent implements OnInit {
  character: GameCharacter | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  isEditing: boolean = false;
  hasReaderAccess=false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.loadCharacter();
    this.hasReaderAccess = this.authService.hasReaderAccess();
  }

  loadCharacter(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.characterService.getCharacterById(id).subscribe(
        character => {
          this.character = character;
        },
        error => console.error('Error loading character:', error)
      );
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveCharacter(): void {
    if (this.character) {
      this.isLoading = true;
      this.error = null;
      this.characterService.updateCharacter(this.character.id, this.character).subscribe(
        () => {
          this.isLoading = false;
          this.isEditing = false;
        },
        error => {
          this.error = error.message;
          this.isLoading = false;
        }
      );
    }
  }

  deleteCharacter(): void {
    if (confirm('Are you sure you want to delete this character?') && this.character) {
      this.characterService.deleteCharacter(this.character.id).subscribe(
        () => {
          this.router.navigate(['/characters']);
        },
        error => console.error('Error deleting character:', error)
      );
    }
  }
} 