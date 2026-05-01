// Unique point d'edition admin pour les votes valides manuels.
(function () {
    const rawVotes = {
        1: 0, // OUSSOU Anais
        2: 1, // DOS SANTOS Marie-Belle
        3: 0, // BIYAOU Fortunelle
        4: 0, // KINTOGANDOU Vanessa
        5: 0, // CHABI-BOUKARI Zahidath
        6: 1, // Kevine DONTE
        7: 21, // LOKO Ingrid
        8: 1, // NONWANON Eurielle
        9: 0, // AMOUSSOU Isnelle
        10: 1, // ADAM-TOURE Amiratou
        11: 0, // HOUENOU Sephora
        12: 2, // AKOTENOU Octavie
        13: 2, // HOUNYO Ornella
        14: 0, // KEDOTE Shammel
        15: 106, // BIYAOU Fortunelle
    };

    window.MANUAL_VALIDATED_VOTES = Object.entries(rawVotes).reduce((safeVotes, [candidateId, value]) => {
        const parsedValue = Math.max(0, Math.floor(Number(value) || 0));
        safeVotes[candidateId] = parsedValue;
        return safeVotes;
    }, {});
})();
