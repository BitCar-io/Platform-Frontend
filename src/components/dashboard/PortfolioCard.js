import React from 'react';
import { Row, Col, Icon, Button, Tooltip } from 'antd';
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { ipfsUrl, secondsToYearsString, bitcarToUSD } from '../../util/helpers';
import { setApprovalState } from '../../util/assetHelpers';
import AddTokenToMetaMask from '../AddTokenToMetaMask';
import { DISPLAY_DECIMALS_USD, ESCROW_CARD_TEXT, HOT_WALLET_TEXT, COLD_WALLET_TEXT } from '../../util/globalVariables';
import LinkTooltip from '../LinkTooltip';
import { URL_CAR_MANAGEMENT, URL_EXTENSION_VOTING, URL_CLAIM_CAR_FUNDS, URL_ASSET } from '../../util/platformNavigation';
import BuyTokenModal from '../asset-actions/buy-tokens/BuyTokenModal';
import AssetActionsContainer from '../asset-actions/AssetActionsContainer';
import { HotWalletIcon, ColdWalletIcon } from '../WalletIcons';

const PortfolioCard = (props) => {
    const approvalState = setApprovalState(props.asset.approvalState);
    const asset = props.asset;
    const cardImage = asset.data.garageImage ? asset.data.garageImage : asset.data.primaryImage;
    const userTokenSplit = asset && asset.userTokenBalance && <div>
        {asset.userTokenBalance.hotBalance && <div>
                <HotWalletIcon /><span className="hot-wallet"> Fractions held in {HOT_WALLET_TEXT} wallet: {asset.userTokenBalance.displayHotBalance}</span>
            </div>
        }
        {asset.userTokenBalance.coldBalance && <div>
                <ColdWalletIcon /><span className="cold-wallet"> Fractions held in {COLD_WALLET_TEXT} wallet: {asset.userTokenBalance.displayColdBalance}</span>
            </div>
        }
        <div>
            Total Fractions owned: {asset.totalUserBalance.dividedBy(asset.totalTokenSupply).multipliedBy(100).toFormat(3)}%
        </div>
    </div>;

    return (
        <Row className={"portfolio-row"}>
            <Link to={URL_ASSET + asset.address}>
                <Col xs={{span:24}} md={{span:10}}>
                    { props.approved === false && <div className="portfolio-banner background-danger">
                        {approvalState}
                    </div> }
                    { props.released === false && <div className="portfolio-banner background-info">AVAILABLE <Moment format="ll">{asset.approvalDate}</Moment></div> }
                    <img src={ipfsUrl + cardImage } className="dashboard-thumbnail" alt='' />
                    {/* <div className="portfolio-banner background-info"><Icon type="hourglass"/>Vote to extend</div> */}
                </Col>
            </Link>
                <Col xs={{span:24}} md={{span:14}} className="portfolio-card-info">
                    <div className="portfolio-card-header">
                        <span>{asset.data.make}</span> {asset.data.model} <AddTokenToMetaMask address={asset.assetTokenContractAddress} symbol={asset.tokenCode} imageUrl={ipfsUrl + cardImage} />
                    </div>

                    <div className="font-14">
                        { props.released !== false && props.portfolioType !== 'agent' && props.portfolioType !== 'admin' && <span>
                            <div className="font-18">
                                <Tooltip overlayClassName="token-tooltip-display" title={userTokenSplit}>
                                    Fractions Owned: <span className="text-brand-main">{asset.displayTotalUserBalance}</span> 
                                </Tooltip>
                            </div>
                            <div className="font-18">
                                <Tooltip overlayClassName="escrow-tooltip-display" title={props.isTickerOnline && `(current value USD $${bitcarToUSD(asset.userEscrow, props.bitcarUsd).toFormat(DISPLAY_DECIMALS_USD)})`}>
                                    {ESCROW_CARD_TEXT}: {asset.userEscrowDisplay}
                                </Tooltip>
                            </div>
                        </span>}
                        <div className="portfolio-actions">
                            <AssetActionsContainer assetAddress={asset.address} buyModalReturnText="Back to my garage" useIcons={true} />
                        </div>
                        { props.portfolioType === 'agent' && asset.approvalDate && <span>
                            <div className="font-18">
                                Fractions Sold: {(props.assetBalance && (((props.assetBalance.qtySold / props.assetBalance.totalTokenSupply) * 100 ).toFixed(2) + '%')) || '0%'}
                            </div>
                            <div>
                                Trading ends: <Moment format="ll">{asset.tradingEndDate}</Moment>
                            </div>
                            { asset.approvalDate && <div>
                                Listed: <Moment format="ll">{asset.approvalDate}</Moment>
                            </div> }
                        </span>}

                        { !asset.approvalDate && <span>
                            <div className="font-18">Term: {secondsToYearsString(asset.tradingPeriodDuration)}</div>
                        </span>
                        }
                    </div>
                    {/* <Button size="small">Create Change Request</Button> */}
                </Col>
        </Row>
    )
}
export default PortfolioCard;
