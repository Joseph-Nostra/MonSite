<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Information;

class InformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'faq',
                'title' => 'Foire Aux Questions (FAQ) - Centre d\'aide',
                'content' => '
                    <div class="faq-container">
                        <section class="mb-5">
                            <h4 class="text-primary border-bottom pb-2 mb-3">💳 Paiement</h4>
                            <div class="accordion" id="faqPaiement">
                                <div class="accordion-item border-0 mb-2 shadow-sm rounded-3 overflow-hidden">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#q1">Quels moyens de paiement acceptez-vous ?</button>
                                    </h2>
                                    <div id="q1" class="accordion-collapse collapse show" data-bs-parent="#faqPaiement">
                                        <div class="accordion-body">Nous acceptons les cartes bancaires (Visa, Mastercard) via Stripe, PayPal, ainsi que le <strong>Paiement à la Livraison</strong>.</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section class="mb-5">
                            <h4 class="text-primary border-bottom pb-2 mb-3">🚚 Livraison</h4>
                            <div class="accordion" id="faqLivraison">
                                <div class="accordion-item border-0 mb-2 shadow-sm rounded-3 overflow-hidden">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#qliv1">Combien de temps prend la livraison ?</button>
                                    </h2>
                                    <div id="qliv1" class="accordion-collapse collapse" data-bs-parent="#faqLivraison">
                                        <div class="accordion-body">Entre 24h et 72h partout au Maroc selon votre ville.</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h4 class="text-primary border-bottom pb-2 mb-3">🔄 Retours</h4>
                            <p>Vous disposez de 7 jours après réception pour retourner votre PC s\'il est neuf et dans son emballage d\'origine.</p>
                        </section>
                    </div>'
            ],
            [
                'slug' => 'shipping',
                'title' => 'Politique de Livraison',
                'content' => '
                    <div class="shipping-policy">
                        <p class="lead mb-4">Nous livrons vos PC portables avec soin et rapidité partout au Maroc 🇲🇦.</p>
                        <ul className="list-group list-group-flush mb-4">
                            <li className="list-group-item d-flex justify-content-between"><span>Casablanca</span> <strong>24h</strong></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Grandes Villes</span> <strong>24h - 48h</strong></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Autres villes</span> <strong>48h - 72h</strong></li>
                        </ul>
                        <div class="alert alert-info">
                            <strong>Frais de livraison :</strong> Gratuits à partir de 1000 MAD. Sinon, forfait de 40 MAD.
                        </div>
                    </div>'
            ],
            [
                'slug' => 'returns',
                'title' => 'Retours & Remboursements',
                'content' => '
                    <div class="returns-policy">
                        <p><strong>Délai de retour :</strong> Possible sous 7 jours après réception.</p>
                        <h5 class="fw-bold mt-4">Conditions :</h5>
                        <ul>
                            <li>Produit neuf et sans rayures</li>
                            <li>Boîte et accessoires complets</li>
                            <li>Non utilisé ou très peu utilisé</li>
                        </ul>
                        <p class="mt-4">Les remboursements sont effectués après vérification technique sous 3 à 7 jours.</p>
                    </div>'
            ],
            [
                'slug' => 'privacy',
                'title' => 'Confidentialité',
                'content' => '<p>Nous protégeons vos données. Vos informations personnelles ne sont utilisées que pour le traitement de vos commandes.</p>'
            ],
            [
                'slug' => 'terms',
                'title' => 'Conditions d\'Utilisation',
                'content' => '<p>L\'utilisation de MonSite implique l\'acceptation pleine et entière de nos conditions générales de vente.</p>'
            ],
            [
                'slug' => 'cookies',
                'title' => 'Cookies',
                'content' => '<p>Nous utilisons des cookies essentiels au fonctionnement du site et des cookies analytiques pour améliorer votre expérience.</p>'
            ]
        ];

        foreach ($pages as $page) {
            Information::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
