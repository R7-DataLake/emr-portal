import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private axiosInstance!: AxiosInstance;

  constructor (@Inject('API_URL') private apiUrl: any) {

    this.axiosInstance = axios.create({
      baseURL: `${this.apiUrl}/profile`
    })

    this.axiosInstance.interceptors.request.use(config => {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    });

    this.axiosInstance.interceptors.response.use(response => {
      return response
    }, error => {
      return Promise.reject(error)
    })
  }

  getBp(cid: any): Promise<AxiosResponse> {
    const url = `/bp`
    return this.axiosInstance.post(url, { cid })
  }

  getPulse(cid: any): Promise<AxiosResponse> {
    const url = `/pulse`
    return this.axiosInstance.post(url, { cid })
  }

  getBmi(cid: any): Promise<AxiosResponse> {
    const url = `/bmi`
    return this.axiosInstance.post(url, { cid })
  }

  getLastAppoint(cid: any): Promise<AxiosResponse> {
    const url = `/last/appoint`
    return this.axiosInstance.post(url, { cid })
  }

}
