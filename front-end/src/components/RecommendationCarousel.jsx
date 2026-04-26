import React, { useEffect, useState } from "react";
import api from "../axios";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./Common/LoadingSpinner";
import { Sparkles } from "lucide-react";

export default function RecommendationCarousel({ title, user, onAddToCart }) {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await api.get("/recommendations");
                setProducts(res.data);
            } catch (err) {
                console.error("Erreur recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <div className="recommendation-carousel my-5 py-4">
            <div className="container">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="fw-bold mb-0">{title || t('recommended_for_you') || "Recommandé pour vous"}</h3>
                </div>

                <div className="row g-4 overflow-auto pb-4 flex-nowrap hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
                    {products.map(product => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ scrollSnapAlign: 'start' }}>
                            <ProductCard 
                                product={product} 
                                user={user} 
                                onAddToCart={onAddToCart} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .recommendation-carousel .card {
                    transition: transform 0.3s ease;
                }
                .recommendation-carousel .card:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    );
}
