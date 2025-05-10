import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Calculator, AlertCircle, CheckCircle } from 'lucide-react';

const BullardCalculator = () => {
  const [isExpanded, setIsExpanded] = useState({});
  const [offer, setOffer] = useState({
    // Financial Terms
    totalPrice: 15,
    cashUpfront: 0,
    paymentType: 'notes',
    mortgageHandling: 'payoff',
    // Non-Financial Terms
    preservation: 7,
    useType: 7,
    reputationProtection: 7,
    jamesUnit: 'yes',
    publicityValue: 5,
    deedRestrictions: 'yes',
    commercialRestrictions: 'yes'
  });

  const competingOffers = {
    wimbledon: {
      totalPrice: 13, // High end estimate
      cashUpfront: 6,
      paymentType: 'mixed',
      mortgageHandling: 'assume',
      preservation: 7,
      useType: 7,
      reputationProtection: 7,
      jamesUnit: 'yes',
      publicityValue: 5,
      deedRestrictions: 'no',
      commercialRestrictions: 'yes'
    },
    gentrification: {
      totalPrice: 15,
      cashUpfront: 0,
      paymentType: 'notes',
      mortgageHandling: 'payoff',
      preservation: 8,
      useType: 9,
      reputationProtection: 7,
      jamesUnit: 'yes',
      publicityValue: 8,
      deedRestrictions: 'yes',
      commercialRestrictions: 'yes'
    },
    grouse: {
      totalPrice: 19.5, // High end estimate
      cashUpfront: 7.5,
      paymentType: 'mixed',
      mortgageHandling: 'assume',
      preservation: 7,
      useType: 5,
      reputationProtection: 7,
      jamesUnit: 'yes',
      publicityValue: 8,
      deedRestrictions: 'no',
      commercialRestrictions: 'no'
    }
  };

  const [selectedCompetitor, setSelectedCompetitor] = useState('gentrification');

  // Weight constants based on case priorities
  const WEIGHTS = {
    preservation: 1.0,
    tastefulUse: 0.8,
    reputationProtection: 0.7,
    financialReturn: 0.6,
    jamesUnit: 0.4,
    publicity: 0.3,
    cashPreference: 0.2
  };

  const calculateOfferScore = (offerData) => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate financial value
    let financialValue = offerData.totalPrice;
    if (offerData.paymentType === 'notes') {
      financialValue *= 0.9;
    }
    if (offerData.mortgageHandling === 'payoff') {
      financialValue -= 2;
    }
    
    // Calculate financial score
    let financialScore = 0;
    if (financialValue >= 22) financialScore = 10;
    else if (financialValue >= 20) financialScore = 9;
    else if (financialValue >= 18) financialScore = 8;
    else if (financialValue >= 15) financialScore = 7;
    else if (financialValue >= 13) financialScore = 6;
    else if (financialValue >= 10) financialScore = 5;
    else financialScore = Math.max(0, financialValue / 3);
    
    // Add weighted scores
    totalScore += offerData.preservation * WEIGHTS.preservation * 10;
    maxPossibleScore += WEIGHTS.preservation * 100;
    
    totalScore += offerData.useType * WEIGHTS.tastefulUse * 10;
    maxPossibleScore += WEIGHTS.tastefulUse * 100;
    
    totalScore += offerData.reputationProtection * WEIGHTS.reputationProtection * 10;
    maxPossibleScore += WEIGHTS.reputationProtection * 100;
    
    totalScore += financialScore * WEIGHTS.financialReturn * 10;
    maxPossibleScore += WEIGHTS.financialReturn * 100;
    
    totalScore += (offerData.jamesUnit === 'yes' ? 10 : 0) * WEIGHTS.jamesUnit * 10;
    maxPossibleScore += WEIGHTS.jamesUnit * 100;
    
    totalScore += offerData.publicityValue * WEIGHTS.publicity * 10;
    maxPossibleScore += WEIGHTS.publicity * 100;
    
    // Cash preference score
    let cashScore = 0;
    if (offerData.paymentType === 'cash') {
      cashScore = 10;
    } else if (offerData.paymentType === 'mixed') {
      cashScore = 7;
    } else {
      cashScore = 3;
    }
    totalScore += cashScore * WEIGHTS.cashPreference * 10;
    maxPossibleScore += WEIGHTS.cashPreference * 100;
    
    return { totalScore, maxPossibleScore, percentage: (totalScore / maxPossibleScore) * 100, financialValue };
  };

  const toggleSection = (section) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field, value) => {
    setOffer(prev => ({ ...prev, [field]: value }));
  };

  const currentOfferScore = calculateOfferScore(offer);
  const competitorScore = calculateOfferScore(competingOffers[selectedCompetitor]);

  const getRecommendation = () => {
    const percentage = currentOfferScore.percentage;
    if (percentage >= 85) return { text: "Excellent - Accept this offer", color: "text-green-600", icon: CheckCircle };
    if (percentage >= 75) return { text: "Good - Consider accepting", color: "text-green-500", icon: CheckCircle };
    if (percentage >= 65) return { text: "Fair - Negotiate improvements", color: "text-yellow-600", icon: AlertCircle };
    return { text: "Below BATNA - Reject or require major improvements", color: "text-red-600", icon: AlertCircle };
  };

  const recommendation = getRecommendation();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Calculator className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Bullard Houses Negotiation Calculator</h1>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Overall Assessment</h2>
            <p className="text-gray-600">Weighted Score: {currentOfferScore.percentage.toFixed(1)}%</p>
          </div>
          <div className="text-4xl font-bold text-blue-600">{currentOfferScore.totalScore.toFixed(0)}/{currentOfferScore.maxPossibleScore}</div>
        </div>
        <div className={`flex items-center mt-3 ${recommendation.color}`}>
          <recommendation.icon className="h-5 w-5 mr-2" />
          <span className="font-medium">{recommendation.text}</span>
        </div>
      </div>

      {/* Financial Terms */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer"
          onClick={() => toggleSection('financial')}
        >
          <h3 className="text-lg font-semibold text-gray-800">Financial Terms</h3>
          {isExpanded.financial ? <ChevronUp /> : <ChevronDown />}
        </div>
        {(isExpanded.financial !== false) && (
          <div className="p-4 border-x border-b rounded-b-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Price ($M)</label>
                <input
                  type="number"
                  value={offer.totalPrice}
                  onChange={(e) => handleChange('totalPrice', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cash Upfront ($M)</label>
                <input
                  type="number"
                  value={offer.cashUpfront}
                  onChange={(e) => handleChange('cashUpfront', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                <select
                  value={offer.paymentType}
                  onChange={(e) => handleChange('paymentType', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="cash">All Cash</option>
                  <option value="mixed">Mixed (Cash + Other)</option>
                  <option value="notes">Notes/Deferred</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mortgage Handling</label>
                <select
                  value={offer.mortgageHandling}
                  onChange={(e) => handleChange('mortgageHandling', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="assume">Buyer Assumes Mortgage</option>
                  <option value="payoff">Seller Must Pay Off</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">Net Financial Value: <span className="text-lg font-bold text-blue-600">${currentOfferScore.financialValue.toFixed(1)}M</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Non-Financial Terms */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer"
          onClick={() => toggleSection('nonfinancial')}
        >
          <h3 className="text-lg font-semibold text-gray-800">Non-Financial Terms</h3>
          {isExpanded.nonfinancial ? <ChevronUp /> : <ChevronDown />}
        </div>
        {(isExpanded.nonfinancial !== false) && (
          <div className="p-4 border-x border-b rounded-b-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preservation Commitment (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={offer.preservation}
                  onChange={(e) => handleChange('preservation', parseInt(e.target.value))}
                  className="mt-1 block w-full"
                />
                <span className="text-sm text-gray-600">Score: {offer.preservation}/10</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tasteful Use Score (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={offer.useType}
                  onChange={(e) => handleChange('useType', parseInt(e.target.value))}
                  className="mt-1 block w-full"
                />
                <span className="text-sm text-gray-600">Score: {offer.useType}/10</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reputation Protection (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={offer.reputationProtection}
                  onChange={(e) => handleChange('reputationProtection', parseInt(e.target.value))}
                  className="mt-1 block w-full"
                />
                <span className="text-sm text-gray-600">Score: {offer.reputationProtection}/10</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">James's Unit?</label>
                  <select
                    value={offer.jamesUnit}
                    onChange={(e) => handleChange('jamesUnit', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deed Restrictions?</label>
                  <select
                    value={offer.deedRestrictions}
                    onChange={(e) => handleChange('deedRestrictions', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Commercial Limits?</label>
                  <select
                    value={offer.commercialRestrictions}
                    onChange={(e) => handleChange('commercialRestrictions', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Publicity Value (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={offer.publicityValue}
                  onChange={(e) => handleChange('publicityValue', parseInt(e.target.value))}
                  className="mt-1 block w-full"
                />
                <span className="text-sm text-gray-600">Score: {offer.publicityValue}/10</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Competitive Comparison */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer"
          onClick={() => toggleSection('comparison')}
        >
          <h3 className="text-lg font-semibold text-gray-800">Competitive Comparison</h3>
          {isExpanded.comparison ? <ChevronUp /> : <ChevronDown />}
        </div>
        {(isExpanded.comparison !== false) && (
          <div className="p-4 border-x border-b rounded-b-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Compare with:</label>
              <select
                value={selectedCompetitor}
                onChange={(e) => setSelectedCompetitor(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              >
                <option value="wimbledon">Wimbledon Properties</option>
                <option value="gentrification">Gentrification Inc. (BATNA)</option>
                <option value="grouse">Grouse Inc.</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Current Offer</h4>
                <p className="text-sm text-gray-600">Total Score: {currentOfferScore.percentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Financial Value: ${currentOfferScore.financialValue.toFixed(1)}M</p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${currentOfferScore.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 capitalize">{selectedCompetitor} {selectedCompetitor === 'gentrification' && '(BATNA)'}</h4>
                <p className="text-sm text-gray-600">Total Score: {competitorScore.percentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Financial Value: ${competitorScore.financialValue.toFixed(1)}M</p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gray-600 rounded-full"
                    style={{ width: `${competitorScore.percentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                {currentOfferScore.percentage > competitorScore.percentage ? 
                  `Current offer scores ${(currentOfferScore.percentage - competitorScore.percentage).toFixed(1)}% higher than ${selectedCompetitor}` :
                  currentOfferScore.percentage < competitorScore.percentage ?
                  `Current offer scores ${(competitorScore.percentage - currentOfferScore.percentage).toFixed(1)}% lower than ${selectedCompetitor}` :
                  `Current offer matches ${selectedCompetitor} score`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer"
          onClick={() => toggleSection('comparisonTable')}
        >
          <h3 className="text-lg font-semibold text-gray-800">Full Offer Comparison Table</h3>
          {isExpanded.comparisonTable ? <ChevronUp /> : <ChevronDown />}
        </div>
        {(isExpanded.comparisonTable !== false) && (
          <div className="p-4 border-x border-b rounded-b-lg overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left text-sm font-semibold text-gray-700">Criteria</th>
                  <th className="border p-2 text-center text-sm font-semibold text-gray-700">Current Offer</th>
                  <th className="border p-2 text-center text-sm font-semibold text-gray-700">Wimbledon</th>
                  <th className="border p-2 text-center text-sm font-semibold text-gray-700">Gentrification (BATNA)</th>
                  <th className="border p-2 text-center text-sm font-semibold text-gray-700">Grouse</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium text-gray-700">Total Price ($M)</td>
                  <td className="border p-2 text-center">${offer.totalPrice}</td>
                  <td className="border p-2 text-center">$13</td>
                  <td className="border p-2 text-center">$15</td>
                  <td className="border p-2 text-center">$19.5</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">Cash Upfront ($M)</td>
                  <td className="border p-2 text-center">${offer.cashUpfront}</td>
                  <td className="border p-2 text-center">$6</td>
                  <td className="border p-2 text-center">$0</td>
                  <td className="border p-2 text-center">$7.5</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-gray-700">Payment Type</td>
                  <td className="border p-2 text-center capitalize">{offer.paymentType}</td>
                  <td className="border p-2 text-center">Mixed</td>
                  <td className="border p-2 text-center">Notes</td>
                  <td className="border p-2 text-center">Mixed</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">Mortgage Handling</td>
                  <td className="border p-2 text-center">{offer.mortgageHandling === 'assume' ? 'Buyer Assumes' : 'Seller Pays Off'}</td>
                  <td className="border p-2 text-center">Buyer Assumes</td>
                  <td className="border p-2 text-center">Seller Pays Off</td>
                  <td className="border p-2 text-center">Buyer Assumes</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-gray-700">Net Financial Value ($M)</td>
                  <td className="border p-2 text-center font-semibold">${currentOfferScore.financialValue.toFixed(1)}</td>
                  <td className="border p-2 text-center font-semibold">${calculateOfferScore(competingOffers.wimbledon).financialValue.toFixed(1)}</td>
                  <td className="border p-2 text-center font-semibold">${calculateOfferScore(competingOffers.gentrification).financialValue.toFixed(1)}</td>
                  <td className="border p-2 text-center font-semibold">${calculateOfferScore(competingOffers.grouse).financialValue.toFixed(1)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">Preservation Score</td>
                  <td className="border p-2 text-center">{offer.preservation}/10</td>
                  <td className="border p-2 text-center">7/10</td>
                  <td className="border p-2 text-center">8/10</td>
                  <td className="border p-2 text-center">7/10</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-gray-700">Tasteful Use Score</td>
                  <td className="border p-2 text-center">{offer.useType}/10</td>
                  <td className="border p-2 text-center">7/10</td>
                  <td className="border p-2 text-center">9/10</td>
                  <td className="border p-2 text-center">5/10</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">Reputation Protection</td>
                  <td className="border p-2 text-center">{offer.reputationProtection}/10</td>
                  <td className="border p-2 text-center">7/10</td>
                  <td className="border p-2 text-center">7/10</td>
                  <td className="border p-2 text-center">7/10</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-gray-700">James's Unit</td>
                  <td className="border p-2 text-center">{offer.jamesUnit === 'yes' ? '✓' : '✗'}</td>
                  <td className="border p-2 text-center">✓</td>
                  <td className="border p-2 text-center">✓</td>
                  <td className="border p-2 text-center">✓</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">Deed Restrictions</td>
                  <td className="border p-2 text-center">{offer.deedRestrictions === 'yes' ? '✓' : '✗'}</td>
                  <td className="border p-2 text-center">✗</td>
                  <td className="border p-2 text-center">✓</td>
                  <td className="border p-2 text-center">✗</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-gray-700">Commercial Restrictions</td>
                  <td className="border p-2 text-center">{offer.commercialRestrictions === 'yes' ? '✓' : '✗'}</td>
                  <td className="border p-2 text-center">✓</td>
                  <td className="border p-2 text-center">✓</td>
                  <td className="border p-2 text-center">✗</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">Publicity Value</td>
                  <td className="border p-2 text-center">{offer.publicityValue}/10</td>
                  <td className="border p-2 text-center">5/10</td>
                  <td className="border p-2 text-center">8/10</td>
                  <td className="border p-2 text-center">8/10</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border p-2 font-bold text-gray-800">Total Weighted Score</td>
                  <td className="border p-2 text-center font-bold text-blue-600">{currentOfferScore.percentage.toFixed(1)}%</td>
                  <td className="border p-2 text-center font-bold">{calculateOfferScore(competingOffers.wimbledon).percentage.toFixed(1)}%</td>
                  <td className="border p-2 text-center font-bold text-green-600">{calculateOfferScore(competingOffers.gentrification).percentage.toFixed(1)}% (BATNA)</td>
                  <td className="border p-2 text-center font-bold">{calculateOfferScore(competingOffers.grouse).percentage.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                <strong>Note:</strong> The weighted score reflects the shareholders' priorities with preservation and tasteful use being the most important factors.
                {currentOfferScore.percentage > calculateOfferScore(competingOffers.gentrification).percentage && 
                  <span className="text-green-600"> The current offer exceeds your BATNA!</span>}
                {currentOfferScore.percentage < calculateOfferScore(competingOffers.gentrification).percentage && 
                  <span className="text-red-600"> The current offer is below your BATNA.</span>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Weighted Priority Breakdown */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer"
          onClick={() => toggleSection('priorities')}
        >
          <h3 className="text-lg font-semibold text-gray-800">Priority Breakdown</h3>
          {isExpanded.priorities ? <ChevronUp /> : <ChevronDown />}
        </div>
        {isExpanded.priorities && (
          <div className="p-4 border-x border-b rounded-b-lg">
            <div className="space-y-2">
              {Object.entries(WEIGHTS).map(([key, weight]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="w-64 flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${weight * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{(weight * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BullardCalculator;