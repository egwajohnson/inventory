import express from 'express';
import { Types } from 'mongoose';

export interface IAddUser{
  // id?: Types.ObjectId; // Optional for creation, required for updates
  title: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  otp: string;
  gender: string;
  DOB: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: number;
  };
  role: UserRole;
}

export type UserRole = "admin" | "customer" | "merchant";


