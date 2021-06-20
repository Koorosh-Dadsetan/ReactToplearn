import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const BlurImage = ({ image }) => (
    <LazyLoadImage effect="blur" src={`https://toplearnapi.ghorbany.dev/${image}`} />
);

export default BlurImage;