import React from "react";
import { Col, Icon } from "antd";
import { ipfsUrl } from "../../util/helpers";
import PropTypes from "prop-types";
import ImageLightbox from "./ImageLightbox";
import axios from "axios";

import Slider from "react-slick";

class AssetImages extends React.Component {
  state = {
    lightboxOpen: false,
    imgIndex: 0,
    thumbnailImages: new Array(this.props.thumbnails.length),
    slider_settings: {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        swipeToSlide: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: 
        [
            {
                breakpoint: 992,
                    settings: {
                        slidesToShow: 3
                    }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
            breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ],
        beforeChange: () => {
            this.setState({ previouslyDragged: true })
        },
        afterChange: () => {
            this.setState({ previouslyDragged: false })
        }
    },
    previouslyDragged: false
  };

  componentDidMount() {
    this.props.thumbnails.map((img, index) => {
        axios.get(ipfsUrl + img, {responseType: 'arraybuffer'}).then(response => {
            const base64Img = new Buffer(response.data, 'binary').toString('base64');
            this.updateThumbnailImages(index, base64Img);
        }).catch(error => {
            this.updateThumbnailImages(index, 'error');
        });
    });
  }

  updateThumbnailImages(index, value) {
        let newImages = [...this.state.thumbnailImages];
        newImages[index] = value;
        this.setState({ thumbnailImages: newImages });
  }

  toggleLightbox = index => {
    if(!this.state.previouslyDragged) {
        this.setState({ imgIndex: index, lightboxOpen: !this.state.lightboxOpen });
    }
  };

  render() {
    return (
      <React.Fragment>
          <Slider {...this.state.slider_settings}>
            { this.state.thumbnailImages.map((img, index) => {
                return <Col xs={6} md={8} lg={6} xl={4} key={index} >
                    { (img === undefined || img === 'error') && <div className="spec-thumbnail background-card-dark" style={{width: '100%', height: 140, textAlign: 'center'}}>
                        { img === undefined && <div className="text-disabled" style={{paddingTop: 60}}><Icon type="loading" /> Image loading...</div> }
                        { img === 'error' && <div className="text-disabled" style={{paddingTop: 60}}><Icon type="warning" /> Image not found.</div> }
                    </div> }

                    { (img !== undefined && img !== 'error') && <img className="spec-thumbnail" alt="" src={'data:image/png;base64, ' + this.state.thumbnailImages[index]} onClick={() => this.toggleLightbox(index)} /> }
                </Col>
            }) }
            </Slider>
        { this.state.lightboxOpen && <ImageLightbox
            images={this.props.images}
            imgIndex={this.state.imgIndex}
            closeLightbox={this.toggleLightbox}
          /> }
      </React.Fragment>
    );
  }
}

AssetImages.propTypes = {
  thumbnails: PropTypes.array.isRequired
};

export default AssetImages;
