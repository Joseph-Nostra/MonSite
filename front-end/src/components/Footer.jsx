import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-4 p-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>&copy; {new Date().getFullYear()} MonSite. Tous droits réservés.</div>
        <div className="mt-2 mt-md-0">
          <a href="/products" className="text-white me-3">Accueil</a>
          <a href="/contact" className="text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}