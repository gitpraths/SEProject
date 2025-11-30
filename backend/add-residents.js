import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./src/config/postgres.js";
import { Shelter } from "./src/pg_models/shelter.js";
import { ShelterResident } from "./src/pg_models/shelterResident.js";

async function addResidents() {
  try {
    console.log("🌱 Adding walk-in residents...");

    // Get shelters
    const shelters = await Shelter.findAll();
    
    if (shelters.length === 0) {
      console.error("❌ No shelters found. Run seed.js first.");
      process.exit(1);
    }

    // Find specific shelters by name
    const ashaKiran = shelters.find(s => s.name === "Asha Kiran Shelter");
    const mumbaiHope = shelters.find(s => s.name === "Mumbai Hope Center");
    const kochiSneha = shelters.find(s => s.name === "Kochi Snehabhavan");
    const trivandrumAnbu = shelters.find(s => s.name === "Trivandrum Anbu Illam");
    const kozhikodeKarunya = shelters.find(s => s.name === "Kozhikode Karunya Bhavan");

    const residentsToAdd = [];

    // Asha Kiran Shelter (Delhi) - 2 residents
    if (ashaKiran) {
      residentsToAdd.push(
        {
          shelter_id: ashaKiran.shelter_id,
          name: "Mohan Das",
          age: 45,
          gender: "Male",
          health_status: "Fair",
          skills: "Plumbing, Electrical work",
          bed_number: "A01",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-10-15"),
          notes: "Walk-in admission. Skilled worker looking for stable housing.",
        },
        {
          shelter_id: ashaKiran.shelter_id,
          name: "Sunita Devi",
          age: 38,
          gender: "Female",
          health_status: "Good",
          skills: "Cooking, Housekeeping",
          bed_number: "A02",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-11-01"),
          notes: "Referred by local community center.",
        }
      );
    }

    // Mumbai Hope Center - 2 residents
    if (mumbaiHope) {
      residentsToAdd.push(
        {
          shelter_id: mumbaiHope.shelter_id,
          name: "Ramesh Patil",
          age: 52,
          gender: "Male",
          health_status: "Poor - Diabetes",
          skills: "Tailoring",
          bed_number: "B05",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-09-20"),
          notes: "Requires regular medical attention for diabetes.",
        },
        {
          shelter_id: mumbaiHope.shelter_id,
          name: "Kavita Sharma",
          age: 29,
          gender: "Female",
          health_status: "Good",
          skills: "Data entry, Computer basics",
          bed_number: "B06",
          status: "active",
          source: "referral",
          admission_date: new Date("2025-10-28"),
          notes: "Referred by women's welfare organization.",
        }
      );
    }

    // Kochi Snehabhavan - 3 residents
    if (kochiSneha) {
      residentsToAdd.push(
        {
          shelter_id: kochiSneha.shelter_id,
          name: "Thomas Mathew",
          age: 41,
          gender: "Male",
          health_status: "Good",
          skills: "Fishing, Boat maintenance",
          bed_number: "K01",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-10-10"),
          notes: "Former fisherman seeking temporary shelter.",
        },
        {
          shelter_id: kochiSneha.shelter_id,
          name: "Leela Menon",
          age: 35,
          gender: "Female",
          health_status: "Fair",
          skills: "Nursing assistant, Caregiving",
          bed_number: "K02",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-11-05"),
          notes: "Healthcare worker between jobs.",
        },
        {
          shelter_id: kochiSneha.shelter_id,
          name: "Arun Kumar",
          age: 27,
          gender: "Male",
          health_status: "Good",
          skills: "Auto mechanic, Driving",
          bed_number: "K03",
          status: "active",
          source: "referral",
          admission_date: new Date("2025-11-12"),
          notes: "Referred by local church.",
        }
      );
    }

    // Trivandrum Anbu Illam - 2 residents
    if (trivandrumAnbu) {
      residentsToAdd.push(
        {
          shelter_id: trivandrumAnbu.shelter_id,
          name: "Padma Kumari",
          age: 48,
          gender: "Female",
          health_status: "Fair - Arthritis",
          skills: "Weaving, Handicrafts",
          bed_number: "T01",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-09-15"),
          notes: "Artisan seeking shelter while recovering health.",
        },
        {
          shelter_id: trivandrumAnbu.shelter_id,
          name: "Biju George",
          age: 33,
          gender: "Male",
          health_status: "Good",
          skills: "Construction, Masonry",
          bed_number: "T02",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-10-22"),
          notes: "Construction worker between projects.",
        }
      );
    }

    // Kozhikode Karunya Bhavan - 2 residents
    if (kozhikodeKarunya) {
      residentsToAdd.push(
        {
          shelter_id: kozhikodeKarunya.shelter_id,
          name: "Abdul Rahman",
          age: 55,
          gender: "Male",
          health_status: "Fair",
          skills: "Carpentry, Furniture making",
          bed_number: "C01",
          status: "active",
          source: "walk_in",
          admission_date: new Date("2025-10-01"),
          notes: "Skilled carpenter seeking stable housing.",
        },
        {
          shelter_id: kozhikodeKarunya.shelter_id,
          name: "Fathima Beevi",
          age: 42,
          gender: "Female",
          health_status: "Good",
          skills: "Tailoring, Embroidery",
          bed_number: "C02",
          status: "active",
          source: "referral",
          admission_date: new Date("2025-11-08"),
          notes: "Referred by women's self-help group.",
        }
      );
    }

    // Create residents
    const residents = await ShelterResident.bulkCreate(residentsToAdd);
    console.log(`✅ Created ${residents.length} walk-in residents`);

    // Update shelter bed counts
    for (const resident of residents) {
      const shelter = await Shelter.findByPk(resident.shelter_id);
      if (shelter && shelter.available_beds > 0) {
        await shelter.update({
          available_beds: shelter.available_beds - 1
        });
      }
    }
    console.log(`✅ Updated shelter bed counts`);

    console.log("\n🎉 Walk-in residents added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding residents:", error);
    process.exit(1);
  }
}

addResidents();
