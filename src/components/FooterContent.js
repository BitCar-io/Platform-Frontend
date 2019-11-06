import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { URL_PRIVACY_POLICY, URL_TERMS_AND_CONDITIONS, URL_AML_POLICY, URL_RETURNS_POLICY } from "../util/platformNavigation";
import { BITCAR_ENTITY, LEGAL_ENTITY } from "../util/globalVariables";

// partner logos
const alphabit_logo = require('../logos/alphabit_logo.png');
const artreserve_logo = require('../logos/artreserve_logo.png');
const digitalx_logo = require('../logos/digitalx_logo.png');
const dadiani_logo = require('../logos/dadiani_logo.png');
const ledger_assets = require('../logos/ledger_assets.png');
const moonlambos_logo = require('../logos/moonlambos_logo.png');
const smartblock_logo = require('../logos/smartblock_logo.png');
// exchange logos
const ddex_logo = require('../logos/ddex.png');
const idex_logo = require('../logos/idex.svg');
const joyso_logo = require('../logos/joyso.png');
const ncx_logo = require('../logos/ncx_exchange.png');
const tokenjar_logo = require('../logos/tokenjar.png');
const blockfolio_logo = require('../logos/blockfolio.svg');

const FooterContent = (props) => (
    <React.Fragment>
        <Row className="footer-partners-section">
            <Col className="footer-section">
                <span style={{marginRight: 5}}>Our partners:</span> 
                <a href="https://alphabit.fund" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={alphabit_logo} width={120} alt="alphabit" /></a>
                <a rel="noopener noreferrer" className="footer-partner-link"><img src={artreserve_logo} width={120} alt="artreserve" /></a>
                <a href="https://digitalx.com" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={digitalx_logo} width={80} alt="digitalx" /></a>
                <a href="https://dadianisyndicate.co.uk" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={dadiani_logo} width={170} alt="dadianisyndicate" /></a>
                <a href="http://ledgerassets.com/" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={ledger_assets} width={170} alt="ledgerassets" /></a>
                <a href="https://moonassets.io" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={moonlambos_logo} width={50} alt="moonassets" /></a>
                <a href="https://www.smartblockcapital.io" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={smartblock_logo} width={100} alt="smartblockcapital" /></a>
            </Col>
            <Col className="footer-section">
                <span style={{marginRight: 5}}>Buy Bitcar on:</span>
                <a href="https://ddex.io" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={ddex_logo} width={100} alt="ddex" /></a> 
                <a href="https://idex.market" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={idex_logo} width={100} alt="idex" /></a>
                <a href="https://joyso.io" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={joyso_logo} width={100} alt="joyso" /></a>
                <a href="https://www.ncx.com.au/" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={ncx_logo} width={100} alt="ncx" /></a>
                <a href="https://tokenjar.io" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={tokenjar_logo} width={100} alt="tokenjar" /></a>
                <a href="https://blockfolio.com" target="_blank" rel="noopener noreferrer" className="footer-partner-link"><img src={blockfolio_logo} width={100} alt="blockfolio" /></a> 
            </Col>
        </Row>
        <br />
        <Row>
        <Col className="footer-section">
            <a href="https://facebook.com/bitcar.io" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-facebook"></i></a>
            <a href="https://twitter.com/bitcar_io" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-twitter"></i></a>
            <a href="https://instagram.com/bitcar.io" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-instagram"></i></a>
            <a href="https://linkedin.com/company/bitcar.io" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-linkedin"></i></a>
            <a href="https://www.youtube.com/channel/UCedEr1a1Xx2XcXorz-1hteQ" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-youtube"></i></a>
            <a href="https://www.reddit.com/r/BitCar" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-reddit"></i></a>
            <a href="https://medium.com/@bitcar" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-medium"></i> </a>
            <a href="https://t.me/bitcar_io" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-telegram"></i></a>
            <a href="https://bitcointalk.org/index.php?topic=2406756.0" target="_blank" rel="noopener noreferrer"><i className="footer-link fab fa-lg fa-bitcoin"></i></a>
        </Col>
        <Col className="footer-section">
            <Link to={URL_AML_POLICY} className="footer-link">AML Policy </Link> | 
            <Link to={URL_PRIVACY_POLICY} className="footer-link">Privacy Policy </Link> | 
            <Link to={URL_RETURNS_POLICY} className="footer-link">Returns Policy </Link> | 
            <Link to={URL_TERMS_AND_CONDITIONS} className="footer-link">Terms and Conditions</Link>
        </Col>
        </Row>
        <Row>
        <Col className="footer-section"> 
            <span className="footer-link">&copy; {new Date().getFullYear()} {BITCAR_ENTITY.entityName} &amp; {LEGAL_ENTITY.entityName}</span> |
            v{process.env.REACT_APP_VERSION}
        </Col>
        </Row>
    </React.Fragment>
);

export default FooterContent;