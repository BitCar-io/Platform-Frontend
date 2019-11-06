import React from 'react';
import Lightbox from 'react-image-lightbox';
import { ipfsUrl } from '../../util/helpers';

class ImageLightbox extends React.Component {
    state = {
        imgIndex: this.props.imgIndex
    }
    render() {
        const {images, closeLightbox} = this.props;
        return (
            <Lightbox enableZoom={true}
                mainSrc={ipfsUrl + images[this.state.imgIndex]}
                nextSrc={ipfsUrl + images[(this.state.imgIndex + 1) % images.length]}
                prevSrc={ipfsUrl + images[(this.state.imgIndex + images.length - 1) % images.length]}
                onCloseRequest={closeLightbox}
                onMovePrevRequest={() =>
                    this.setState({
                        imgIndex: (this.state.imgIndex + images.length - 1) % images.length,
                    })
                }
                onMoveNextRequest={() =>
                    this.setState({
                        imgIndex: (this.state.imgIndex + 1) % images.length,
                    })
                }
            />
        )
    }
}
export default ImageLightbox;