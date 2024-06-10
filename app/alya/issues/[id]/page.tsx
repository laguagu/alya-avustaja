"use client";

import React, { useState, useEffect } from "react";
import { Payment } from "../../furnitures/[id]/page";
// Oletetaan, että meillä on funktio, joka hakee käyttäjän tiedot id:n perusteella
async function fetchUser(id: string) {
  // Tässä on esimerkki, korvaa tämä todellisella koodilla
  return {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "john.doe@example.com",
    alyaHankeMaksu: false,
  };
}

// Oletetaan, että meillä on funktio, joka päivittää käyttäjän tiedot
async function updateUser(user: Payment): Promise<void> {
  // Tässä on esimerkki, korvaa tämä todellisella koodilla
  console.log("Updating user", user);
}

export default function Page({ params }: { params?: { id?: string } }) {
  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Huoltopyynnön id {params?.id}</h1>
    </div>
  );
}
