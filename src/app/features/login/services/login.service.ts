import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private axiosInstance!: AxiosInstance;

  constructor (@Inject('API_URL') private apiUrl: any) {
    this.axiosInstance = axios.create({
      baseURL: `${this.apiUrl}`
    })
  }

  login(username: any, password: any): Promise<AxiosResponse> {
    const url = `/login`
    return this.axiosInstance.post(url, { username, password })
  }

}
