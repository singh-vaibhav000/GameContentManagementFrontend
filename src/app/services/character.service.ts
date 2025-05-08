import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameCharacter } from '../models/game-character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = 'https://gamecontentmanagerbackend-1.onrender.com/api/gamecharacter';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCharacters(): Observable<GameCharacter[]> {
    return this.http.get<GameCharacter[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getCharacterById(id: string): Observable<GameCharacter> {
    return this.http.get<GameCharacter>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createCharacter(character: GameCharacter): Observable<GameCharacter> {
    return this.http.post<GameCharacter>(this.apiUrl, character, { headers: this.getHeaders() });
  }

  updateCharacter(id: string, character: GameCharacter): Observable<GameCharacter> {
    return this.http.put<GameCharacter>(`${this.apiUrl}/${id}`, character, { headers: this.getHeaders() });
  }

  deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchCharacters(term: string): Observable<GameCharacter[]> {
    return this.http.get<GameCharacter[]>(`${this.apiUrl}/search?term=${term}`, { headers: this.getHeaders() });
  }
} 