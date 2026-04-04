import express from "express";
import { Types } from "mongoose";

export interface IAddUser {
  title: string;
  firstName: ["Mr", "Mrs", "Ms", "Dr", "Prof"];
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
  isLoggedIn: boolean;
  refreshToken: string | null;
}

export type UserRole = "admin" | "customer" | "merchant";
