import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axios';
import LoadingSpinner from './Common/LoadingSpinner';

const InfoPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/info/${slug}`);
                setPage(res.data);
                setError(null);
            } catch (err) {
                setError("Page non trouvée");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return <div className="container mt-5 pt-5 text-center"><LoadingSpinner size="lg" /></div>;
    if (error) return <div className="container py-5 text-center text-danger"><h3>{error}</h3></div>;

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        <h1 className="fw-bold mb-4 text-primary">{page.title}</h1>
                        <hr className="mb-5 opacity-10" />
                        <div 
                            className="lh-lg" 
                            style={{ fontSize: '1.1rem', color: '#4b5563' }}
                            dangerouslySetInnerHTML={{ __html: page.content }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
