"use client";
import { useContext } from 'react';
import { FriendContext } from '../context/FriendContext';

export default function useFriends() {
  const context = useContext(FriendContext);
  return context;
}