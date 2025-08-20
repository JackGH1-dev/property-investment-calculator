// Market Data Integration Service
// Provides comprehensive Australian property market data and analysis

class MarketDataService {
    constructor() {
        this.apiEndpoints = {
            domain: 'https://api.domain.com.au/v1',
            corelogic: 'https://api.corelogic.com.au/v1',
            abs: 'https://api.abs.gov.au/data', // Australian Bureau of Statistics
            rba: 'https://api.rba.gov.au/v1' // Reserve Bank of Australia
        };
        
        this.cache = new Map();
        this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
        
        // Mock data structure for demonstration
        this.mockData = this.initializeMockData();
    }

    initializeMockData() {
        return {
            suburbs: {
                'Bondi Beach': { state: 'NSW', postcode: '2026' },
                'South Yarra': { state: 'VIC', postcode: '3141' },
                'West End': { state: 'QLD', postcode: '4101' },
                'Glenelg': { state: 'SA', postcode: '5045' },
                'Fremantle': { state: 'WA', postcode: '6160' },
                'Battery Point': { state: 'TAS', postcode: '7004' },
                'Braddon': { state: 'ACT', postcode: '2612' },
                'The Gardens': { state: 'NT', postcode: '0820' }
            },
            nationalData: {
                medianHousePrice: 850000,
                medianUnitPrice: 650000,
                nationalGrowthRate: 6.2,
                rentalYieldHouse: 4.1,
                rentalYieldUnit: 4.8,
                vacancyRate: 2.1,
                populationGrowth: 1.4
            }
        };
    }

    // Main method to get comprehensive suburb data
    async getSuburbMarketData(suburb, state, postcode = null) {
        const cacheKey = `suburb:${suburb}:${state}`;
        
        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Try real APIs first, then fallback to mock
            const data = await this.fetchSuburbDataFromAPIs(suburb, state, postcode) ||
                         await this.generateMockSuburbData(suburb, state, postcode);
            
            this.setCache(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error('Market data fetch failed:', error);
            // Always fallback to mock data
            const mockData = await this.generateMockSuburbData(suburb, state, postcode);
            this.setCache(cacheKey, mockData);
            return mockData;
        }
    }

    // Fetch real API data (when available)
    async fetchSuburbDataFromAPIs(suburb, state, postcode) {
        // This would integrate with real APIs when keys are available
        return null; // Placeholder for real implementation
    }

    // Generate comprehensive mock suburb data
    async generateMockSuburbData(suburb, state, postcode) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        const basePrice = this.calculateBasePriceByLocation(suburb, state);
        const demographics = this.generateDemographics(suburb, state);
        const infrastructure = this.generateInfrastructure(suburb, state);
        
        return {
            location: {
                suburb: suburb,
                state: state,
                postcode: postcode || this.generatePostcode(suburb, state),
                region: this.getRegion(suburb, state),
                distanceFromCBD: this.calculateDistanceFromCBD(suburb, state)
            },
            pricing: {
                medianHousePrice: basePrice,
                medianUnitPrice: Math.round(basePrice * 0.75),
                priceGrowth: {
                    '1Year': (Math.random() * 20 - 5).toFixed(1), // -5% to 15%
                    '3Year': (Math.random() * 15 + 5).toFixed(1), // 5% to 20%
                    '5Year': (Math.random() * 12 + 8).toFixed(1), // 8% to 20%
                    '10Year': (Math.random() * 8 + 6).toFixed(1)  // 6% to 14%
                },
                priceRange: {
                    houses: {
                        min: Math.round(basePrice * 0.6),
                        max: Math.round(basePrice * 1.8),
                        q1: Math.round(basePrice * 0.8),
                        q3: Math.round(basePrice * 1.3)
                    },
                    units: {
                        min: Math.round(basePrice * 0.4),
                        max: Math.round(basePrice * 1.2),
                        q1: Math.round(basePrice * 0.6),
                        q3: Math.round(basePrice * 0.9)
                    }
                }
            },
            rental: {
                medianRentHouse: Math.round(basePrice * 0.05 / 52),
                medianRentUnit: Math.round(basePrice * 0.75 * 0.06 / 52),
                rentalYield: {
                    houses: ((basePrice * 0.05) / basePrice * 100).toFixed(1),
                    units: ((basePrice * 0.75 * 0.06) / (basePrice * 0.75) * 100).toFixed(1)
                },
                vacancyRate: (Math.random() * 6 + 0.5).toFixed(1), // 0.5% to 6.5%
                rentalGrowth: (Math.random() * 6 + 1).toFixed(1)   // 1% to 7%
            },
            salesData: {
                salesVolume12Months: Math.floor(Math.random() * 200) + 50,
                daysOnMarket: Math.floor(Math.random() * 60) + 15,
                auctionClearanceRate: (Math.random() * 40 + 50).toFixed(1), // 50% to 90%
                settlementTime: Math.floor(Math.random() * 20) + 30, // 30-50 days
                listingStock: Math.floor(Math.random() * 100) + 20
            },
            demographics: demographics,
            infrastructure: infrastructure,
            investment: {
                investmentGrade: this.calculateInvestmentGrade(basePrice, demographics, infrastructure),
                riskLevel: this.calculateRiskLevel(suburb, state),
                growthPotential: this.calculateGrowthPotential(suburb, state, infrastructure),
                cashFlowPotential: this.calculateCashFlowPotential(basePrice)
            },
            comparables: await this.generateComparableSuburbs(suburb, state),
            forecast: this.generateForecast(basePrice, suburb, state),
            lastUpdated: new Date().toISOString()
        };
    }

    calculateBasePriceByLocation(suburb, state) {
        const statePriceMultipliers = {
            'NSW': 1.2,
            'VIC': 1.0,
            'QLD': 0.8,
            'WA': 0.9,
            'SA': 0.7,
            'TAS': 0.6,
            'ACT': 1.1,
            'NT': 0.7
        };
        
        const premiumSuburbs = [
            'Bondi Beach', 'Toorak', 'South Yarra', 'Double Bay', 'Mosman',
            'Cottesloe', 'Glenelg', 'Battery Point'
        ];
        
        const basePrice = 700000;
        const stateMultiplier = statePriceMultipliers[state] || 1.0;
        const premiumMultiplier = premiumSuburbs.includes(suburb) ? 1.5 : 1.0;
        
        return Math.round(basePrice * stateMultiplier * premiumMultiplier * (0.8 + Math.random() * 0.4));
    }

    generateDemographics(suburb, state) {
        return {
            population: Math.floor(Math.random() * 40000) + 10000,
            medianAge: Math.floor(Math.random() * 25) + 25,
            medianHouseholdIncome: Math.floor(Math.random() * 60000) + 60000,
            familyHouseholds: Math.floor(Math.random() * 40) + 30,
            renters: Math.floor(Math.random() * 30) + 20,
            universityEducated: Math.floor(Math.random() * 40) + 30,
            populationGrowth5Year: (Math.random() * 4).toFixed(1),
            employmentRate: (94 + Math.random() * 5).toFixed(1),
            majorIndustries: this.generateMajorIndustries(),
            culturalDiversity: Math.floor(Math.random() * 50) + 20
        };
    }

    generateInfrastructure(suburb, state) {
        return {
            transportScore: Math.floor(Math.random() * 4) + 6, // 6-10
            schoolRating: Math.floor(Math.random() * 4) + 6,   // 6-10
            hospitalProximity: Math.floor(Math.random() * 20) + 5, // 5-25km
            shoppingCenters: Math.floor(Math.random() * 5) + 1,
            restaurants: Math.floor(Math.random() * 50) + 10,
            publicTransport: {
                trainStations: Math.floor(Math.random() * 3),
                busRoutes: Math.floor(Math.random() * 10) + 5,
                proximityToCBD: Math.floor(Math.random() * 30) + 5
            },
            recreation: {
                parks: Math.floor(Math.random() * 10) + 2,
                beaches: this.hasBeach(suburb) ? Math.floor(Math.random() * 3) + 1 : 0,
                sportsClubs: Math.floor(Math.random() * 8) + 2,
                libraries: Math.floor(Math.random() * 3) + 1
            },
            futureInfrastructure: this.generateFutureInfrastructure(suburb, state)
        };
    }

    generateMajorIndustries() {
        const industries = [
            'Professional Services', 'Healthcare', 'Education', 'Retail',
            'Manufacturing', 'Construction', 'Tourism', 'Technology',
            'Finance', 'Government', 'Mining', 'Agriculture'
        ];
        
        const numIndustries = Math.floor(Math.random() * 4) + 3;
        return industries.sort(() => 0.5 - Math.random()).slice(0, numIndustries);
    }

    hasBeach(suburb) {
        const beachSuburbs = [
            'Bondi Beach', 'Manly', 'Surfers Paradise', 'Cottesloe',
            'Glenelg', 'Brighton', 'St Kilda'
        ];
        return beachSuburbs.some(beach => suburb.toLowerCase().includes(beach.toLowerCase()));
    }

    generateFutureInfrastructure(suburb, state) {
        const projects = [
            'New train line extension',
            'Shopping center redevelopment',
            'Hospital expansion',
            'New school construction',
            'Highway upgrade',
            'Business district development',
            'Recreational facilities',
            'University campus'
        ];
        
        const numProjects = Math.floor(Math.random() * 3) + 1;
        return projects.sort(() => 0.5 - Math.random()).slice(0, numProjects).map(project => ({
            project: project,
            expectedCompletion: (new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).toString(),
            impactLevel: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
        }));
    }

    async generateComparableSuburbs(suburb, state) {
        const allSuburbs = Object.keys(this.mockData.suburbs).filter(s => 
            s !== suburb && this.mockData.suburbs[s].state === state
        );
        
        const numComparables = Math.min(3, allSuburbs.length);
        const comparables = [];
        
        for (let i = 0; i < numComparables; i++) {
            const compSuburb = allSuburbs[Math.floor(Math.random() * allSuburbs.length)];
            const basePrice = this.calculateBasePriceByLocation(compSuburb, state);
            
            comparables.push({
                suburb: compSuburb,
                medianPrice: basePrice,
                growth1Year: (Math.random() * 20 - 5).toFixed(1),
                rentalYield: ((basePrice * 0.05) / basePrice * 100).toFixed(1),
                similarityScore: (Math.random() * 30 + 70).toFixed(1) // 70-100%
            });
        }
        
        return comparables;
    }

    generateForecast(basePrice, suburb, state) {
        const years = [1, 2, 3, 5, 10];
        const forecast = [];
        
        let currentPrice = basePrice;
        const baseGrowthRate = 0.06 + (Math.random() * 0.04); // 6-10%
        
        years.forEach(year => {
            const cumulativeGrowth = Math.pow(1 + baseGrowthRate, year) - 1;
            const projectedPrice = Math.round(basePrice * (1 + cumulativeGrowth));
            const confidence = Math.max(90 - (year * 5), 60); // Decreasing confidence over time
            
            forecast.push({
                year: year,
                projectedPrice: projectedPrice,
                growth: (cumulativeGrowth * 100).toFixed(1),
                confidence: confidence,
                scenario: {
                    conservative: Math.round(projectedPrice * 0.85),
                    optimistic: Math.round(projectedPrice * 1.15)
                }
            });
        });
        
        return forecast;
    }

    calculateInvestmentGrade(basePrice, demographics, infrastructure) {
        let score = 0;
        
        // Price affordability
        if (basePrice < 600000) score += 20;
        else if (basePrice < 800000) score += 15;
        else if (basePrice < 1000000) score += 10;
        else score += 5;
        
        // Demographics
        if (demographics.populationGrowth5Year > 2) score += 15;
        else if (demographics.populationGrowth5Year > 1) score += 10;
        else score += 5;
        
        if (demographics.medianHouseholdIncome > 100000) score += 15;
        else if (demographics.medianHouseholdIncome > 80000) score += 10;
        else score += 5;
        
        // Infrastructure
        if (infrastructure.transportScore >= 8) score += 15;
        else if (infrastructure.transportScore >= 6) score += 10;
        else score += 5;
        
        if (infrastructure.schoolRating >= 8) score += 15;
        else if (infrastructure.schoolRating >= 6) score += 10;
        else score += 5;
        
        // Future infrastructure
        score += infrastructure.futureInfrastructure.length * 5;
        
        if (score >= 85) return 'A+';
        if (score >= 75) return 'A';
        if (score >= 65) return 'B+';
        if (score >= 55) return 'B';
        if (score >= 45) return 'C+';
        if (score >= 35) return 'C';
        return 'D';
    }

    calculateRiskLevel(suburb, state) {
        const riskFactors = [];
        let riskScore = 0;
        
        // Market volatility by state
        const stateRisk = {
            'NSW': 3, 'VIC': 3, 'QLD': 4, 'WA': 5, 'SA': 4, 'TAS': 5, 'ACT': 2, 'NT': 6
        };
        riskScore += stateRisk[state] || 4;
        
        // Distance from major cities
        if (this.isRegionalArea(suburb, state)) {
            riskScore += 2;
            riskFactors.push('Regional location');
        }
        
        // Economic dependency
        if (this.isMiningDependent(suburb, state)) {
            riskScore += 3;
            riskFactors.push('Mining economy dependency');
        }
        
        if (riskScore <= 3) return { level: 'Low', factors: riskFactors };
        if (riskScore <= 6) return { level: 'Moderate', factors: riskFactors };
        if (riskScore <= 9) return { level: 'High', factors: riskFactors };
        return { level: 'Very High', factors: riskFactors };
    }

    calculateGrowthPotential(suburb, state, infrastructure) {
        let score = 5; // Base score
        
        // Infrastructure development
        score += infrastructure.futureInfrastructure.length;
        
        // Transport access
        if (infrastructure.transportScore >= 8) score += 2;
        
        // Population growth area
        if (['NSW', 'VIC', 'QLD', 'ACT'].includes(state)) score += 1;
        
        if (score >= 10) return 'Excellent';
        if (score >= 8) return 'Very Good';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Moderate';
        return 'Limited';
    }

    calculateCashFlowPotential(basePrice) {
        const rentalYield = (basePrice * 0.05) / basePrice * 100;
        
        if (rentalYield >= 6) return 'Excellent';
        if (rentalYield >= 5) return 'Very Good';
        if (rentalYield >= 4) return 'Good';
        if (rentalYield >= 3.5) return 'Moderate';
        return 'Poor';
    }

    isRegionalArea(suburb, state) {
        const majorCities = [
            'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Darwin', 'Hobart'
        ];
        // Simplified check - in real implementation, would use location data
        return Math.random() < 0.3;
    }

    isMiningDependent(suburb, state) {
        return ['WA', 'QLD', 'NT'].includes(state) && Math.random() < 0.4;
    }

    generatePostcode(suburb, state) {
        const postcodeMaps = {
            'NSW': () => Math.floor(Math.random() * 3000) + 2000,
            'VIC': () => Math.floor(Math.random() * 2000) + 3000,
            'QLD': () => Math.floor(Math.random() * 1000) + 4000,
            'SA': () => Math.floor(Math.random() * 1000) + 5000,
            'WA': () => Math.floor(Math.random() * 1000) + 6000,
            'TAS': () => Math.floor(Math.random() * 1000) + 7000,
            'ACT': () => Math.floor(Math.random() * 100) + 2600,
            'NT': () => Math.floor(Math.random() * 100) + 800
        };
        
        return postcodeMaps[state] ? postcodeMaps[state]().toString() : '0000';
    }

    getRegion(suburb, state) {
        const regions = {
            'NSW': ['Greater Sydney', 'Hunter', 'Illawarra', 'Richmond-Tweed', 'Mid North Coast'],
            'VIC': ['Greater Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Latrobe Valley'],
            'QLD': ['Greater Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns'],
            'WA': ['Greater Perth', 'Mandurah', 'Bunbury', 'Kalgoorlie', 'Geraldton'],
            'SA': ['Greater Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge'],
            'TAS': ['Greater Hobart', 'Launceston', 'Devonport'],
            'ACT': ['Australian Capital Territory'],
            'NT': ['Greater Darwin', 'Alice Springs']
        };
        
        const stateRegions = regions[state] || ['Unknown'];
        return stateRegions[Math.floor(Math.random() * stateRegions.length)];
    }

    calculateDistanceFromCBD(suburb, state) {
        return Math.floor(Math.random() * 50) + 5; // 5-55km
    }

    // Get national market overview
    async getNationalMarketData() {
        const cacheKey = 'national:overview';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            // Mock national data with realistic variations
            const data = {
                overview: {
                    medianHousePrice: this.mockData.nationalData.medianHousePrice + (Math.random() * 100000 - 50000),
                    medianUnitPrice: this.mockData.nationalData.medianUnitPrice + (Math.random() * 50000 - 25000),
                    nationalGrowthRate: (this.mockData.nationalData.nationalGrowthRate + (Math.random() * 4 - 2)).toFixed(1),
                    totalListings: Math.floor(Math.random() * 100000) + 200000,
                    clearanceRate: (Math.random() * 30 + 60).toFixed(1)
                },
                stateData: await this.generateStateMarketData(),
                trends: {
                    interestRates: {
                        current: 4.35,
                        trend: 'stable',
                        forecast6Months: 4.5,
                        forecast12Months: 4.25
                    },
                    migration: {
                        interstate: 1.2,
                        overseas: 2.1,
                        trend: 'increasing'
                    },
                    construction: {
                        approvalsGrowth: (Math.random() * 20 - 10).toFixed(1),
                        completionsGrowth: (Math.random() * 15 - 5).toFixed(1)
                    }
                },
                forecast: this.generateNationalForecast()
            };
            
            this.setCache(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error('National data fetch failed:', error);
            throw error;
        }
    }

    async generateStateMarketData() {
        const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
        const stateData = {};
        
        states.forEach(state => {
            const basePrice = this.calculateBasePriceByLocation('Average', state) * 1.2; // State median
            stateData[state] = {
                medianHousePrice: basePrice,
                medianUnitPrice: Math.round(basePrice * 0.75),
                growth1Year: (Math.random() * 20 - 5).toFixed(1),
                rentalYield: (3.5 + Math.random() * 2).toFixed(1),
                vacancyRate: (1 + Math.random() * 4).toFixed(1),
                salesVolume: Math.floor(Math.random() * 50000) + 10000,
                daysOnMarket: Math.floor(Math.random() * 30) + 20
            };
        });
        
        return stateData;
    }

    generateNationalForecast() {
        const years = [1, 2, 3, 5];
        const forecast = [];
        
        years.forEach(year => {
            forecast.push({
                year: year,
                priceGrowth: (Math.random() * 8 + 2).toFixed(1), // 2-10%
                rentalGrowth: (Math.random() * 4 + 2).toFixed(1), // 2-6%
                interestRateForecast: (4.35 + (Math.random() * 2 - 1)).toFixed(2), // 3.35-5.35%
                confidence: Math.max(85 - (year * 5), 65)
            });
        });
        
        return forecast;
    }

    // Get interest rate trends and forecasts
    async getInterestRateData() {
        const cacheKey = 'interest:rates';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const data = {
            current: {
                cashRate: 4.35,
                averageMortgageRate: 6.5,
                lastChanged: '2024-11-01',
                direction: 'stable'
            },
            history: this.generateInterestRateHistory(),
            forecast: {
                next3Months: 4.35,
                next6Months: 4.5,
                next12Months: 4.25,
                rationale: 'RBA maintaining restrictive stance to combat inflation'
            },
            impact: {
                on100kLoan: {
                    currentMonthly: 578,
                    if1PercentHigher: 662,
                    if1PercentLower: 503
                },
                on500kLoan: {
                    currentMonthly: 2890,
                    if1PercentHigher: 3310,
                    if1PercentLower: 2515
                }
            }
        };
        
        this.setCache(cacheKey, data);
        return data;
    }

    generateInterestRateHistory() {
        const history = [];
        const months = 24;
        let currentRate = 4.35;
        
        for (let i = months; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            // Add some realistic variation
            if (Math.random() < 0.1) { // 10% chance of rate change
                currentRate += Math.random() < 0.5 ? 0.25 : -0.25;
                currentRate = Math.max(0.1, Math.min(8.0, currentRate));
            }
            
            history.push({
                date: date.toISOString().split('T')[0],
                rate: parseFloat(currentRate.toFixed(2))
            });
        }
        
        return history;
    }

    // Cache management
    getFromCache(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.cacheTimeout) {
            return item.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(value) {
        return `${parseFloat(value).toFixed(1)}%`;
    }

    // Public API for easy integration
    async getPropertyInvestmentData(suburb, state, propertyType = 'house') {
        const marketData = await this.getSuburbMarketData(suburb, state);
        const nationalData = await this.getNationalMarketData();
        const interestRates = await this.getInterestRateData();
        
        return {
            suburb: marketData,
            national: nationalData,
            interestRates: interestRates,
            recommendations: this.generateInvestmentRecommendations(marketData, nationalData),
            lastUpdated: new Date().toISOString()
        };
    }

    generateInvestmentRecommendations(suburbData, nationalData) {
        const recommendations = [];
        
        // Price growth recommendations
        const growth1Year = parseFloat(suburbData.pricing.priceGrowth['1Year']);
        if (growth1Year > 10) {
            recommendations.push({
                type: 'positive',
                category: 'Growth',
                message: `Excellent capital growth of ${growth1Year}% in the last year, well above national average.`
            });
        } else if (growth1Year < 0) {
            recommendations.push({
                type: 'warning',
                category: 'Growth',
                message: `Property values declined ${Math.abs(growth1Year)}% in the last year. Consider timing of purchase.`
            });
        }
        
        // Rental yield recommendations
        const rentalYield = parseFloat(suburbData.rental.rentalYield.houses);
        if (rentalYield > 5.5) {
            recommendations.push({
                type: 'positive',
                category: 'Cash Flow',
                message: `High rental yield of ${rentalYield}% provides excellent cash flow potential.`
            });
        } else if (rentalYield < 3.5) {
            recommendations.push({
                type: 'caution',
                category: 'Cash Flow',
                message: `Low rental yield of ${rentalYield}%. Ensure strong capital growth prospects justify investment.`
            });
        }
        
        // Investment grade recommendation
        if (suburbData.investment.investmentGrade.startsWith('A')) {
            recommendations.push({
                type: 'positive',
                category: 'Overall',
                message: `Investment grade ${suburbData.investment.investmentGrade} indicates strong fundamentals for property investment.`
            });
        }
        
        return recommendations;
    }
}

// Export for global use
window.MarketDataService = MarketDataService;