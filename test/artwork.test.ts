import assert from 'assert';
import { mintArtwork } from '../setup/src/artwork';

describe("Artwork issue a contract", ()=>{
    it('should issue a new contract',async () => {
        const artworkId = await mintArtwork(
            500,
            10,
            100,
            "Mona Lisa",
            "Leonardo da Vinci",
            "1685548680595",
            "Choconta painting",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"        
        )
        assert.ok(artworkId);
    })
})