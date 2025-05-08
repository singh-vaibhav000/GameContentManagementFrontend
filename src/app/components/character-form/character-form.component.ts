import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameCharacter } from '../../models/game-character';
import { CharacterService } from '../../services/character.service';
@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.css']
})
export class CharacterFormComponent implements OnInit {
  characterForm: FormGroup;
  isEditMode: boolean = false;
  characterId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      rarity: ['Common', Validators.required],
      upgradeLevel: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      sortOrder: [0, Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.characterId;

    if (this.isEditMode && this.characterId) {
      this.loadCharacter(this.characterId);
    }
  }

  private loadCharacter(id: string): void {
    this.characterService.getCharacterById(id).subscribe({
      next: (character) => {
        this.characterForm.patchValue(character);
      },
      error: (err) => {
        console.error('Error loading character:', err);
        this.router.navigate(['/characters']);
      }
    });
  }

  onSubmit(): void {
    if (this.characterForm.valid) {
      const character: GameCharacter = {
        ...this.characterForm.value,
        id: this.characterId || undefined
      };

      if (this.isEditMode && this.characterId) {
        this.characterService.updateCharacter(this.characterId, character).subscribe({
          next: () => {
            this.router.navigate(['/characters', this.characterId]);
          },
          error: (err) => {
            console.error('Error updating character:', err);
          }
        });
      } else {
        this.characterService.createCharacter(character).subscribe({
          next: (createdCharacter) => {
            this.router.navigate(['/characters', createdCharacter.id]);
          },
          error: (err) => {
            console.error('Error creating character:', err);
          }
        });
      }
    }
  }
} 