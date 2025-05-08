import { Component, OnInit } from '@angular/core';
import { GameCharacter } from '../../models/game-character';
import { CharacterService } from '../../services/character.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters: GameCharacter[] = [];
  filteredCharacters: GameCharacter[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  canCreateCharacter: boolean = false;

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private authService: AuthService

  ) {}

  ngOnInit(): void {
    this.loadCharacters();
    this.checkCreatePermission();

  }
  private checkCreatePermission(): void {
    this.canCreateCharacter = this.authService.hasAdminAccess() || this.authService.hasWriteAccess();
  }
  
  loadCharacters(): void {
    this.isLoading = true;
    this.error = null;
    
    this.characterService.getAllCharacters().subscribe({
      next: characters => {
        this.characters = characters;
        this.filteredCharacters = characters;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading characters:', error);
        this.error = 'Failed to load characters. Please try again.';
        this.isLoading = false;
      }
    });
  }
  onCreateCharacter(): void {
    this.router.navigate(['/characters/new']);
  }

  searchCharacters(): void {
    if (!this.searchTerm) {
      this.filteredCharacters = this.characters;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.characterService.searchCharacters(this.searchTerm).subscribe({
      next: characters => {
        this.filteredCharacters = characters;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error searching characters:', error);
        this.error = 'Failed to search characters. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onCharacterClick(character: GameCharacter): void {
    if (character?.id) {
      this.router.navigate(['/characters', character.id]);
    }
  }
} 