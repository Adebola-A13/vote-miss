// Unique point d'edition admin pour les votes valides manuels.
(function () {
    const rawVotes = {
        1: 10, // OUSSOU Anais
        2: 0, // DOS SANTOS Marie-Belle
        3: 0, // BIYAOU Fortunelle
        4: 0, // KINTOGANDOU Vanessa
        5: 0, // CHABI-BOUKARI Zahidath
        6: 0, // Kevine DONTE
        7: 0, // LOKO Ingrid
        8: 0, // NONWANON Eurielle
        9: 0, // AMOUSSOU Isnelle
        10: 0, // ADAM-TOURE Amiratou
        11: 0, // HOUENOU Sephora
        12: 0, // AKOTENOU Octavie
        13: 0, // HOUNYO Ornella
        14: 0 // KEDOTE Shammel
    };

    window.MANUAL_VALIDATED_VOTES = Object.entries(rawVotes).reduce((safeVotes, [candidateId, value]) => {
        const parsedValue = Math.max(0, Math.floor(Number(value) || 0));
        safeVotes[candidateId] = parsedValue;
        return safeVotes;
    }, {});
})();
