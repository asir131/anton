import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export function TermsAndConditions() {
  const navigate = useNavigate(); // MUST be inside the component

  return (
    <div className="py-8">
      <div className="container-premium max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-accent hover:underline mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="card-premium p-8">
            <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>

            <div className="text-sm text-text-secondary mb-8">
              Last updated: January 2024
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              {/* ----------------------------- */}
              {/* Full Content Below (Untouched) */}
              {/* ----------------------------- */}

              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-text-secondary mb-4">
                  Welcome to CompetitionHub. These terms and conditions outline
                  the rules and regulations for the use of our website and participation
                  in our competitions.
                </p>
                <p className="text-text-secondary">
                  By accessing this website and participating in our competitions,
                  you accept these terms and conditions in full...
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Participants must be 18 years of age or older</li>
                  <li>Participants must be residents of the United Kingdom</li>
                  <li>Employees of CompetitionHub...</li>
                  <li>Only one entry per person...</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Entry Methods</h2>
                <h3 className="text-xl font-semibold mb-3">Online Entry</h3>
                <p className="text-text-secondary mb-4">
                  Participants can enter competitions by purchasing tickets...
                </p>

                <h3 className="text-xl font-semibold mb-3">Postal Entry</h3>
                <p className="text-text-secondary">
                  Free postal entries are accepted...
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Competition Draw</h2>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>All competitions will close on the specified end date</li>
                  <li>Winners will be selected via random draw</li>
                  <li>The draw will be conducted fairly...</li>
                  <li>Winners will be notified within 24 hours...</li>
                  <li>Winner announcements will be made...</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Prize Collection</h2>
                <p className="text-text-secondary mb-4">
                  Winners must respond within 7 days...
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Prizes cannot be exchanged for cash</li>
                  <li>Prizes are non-transferable</li>
                  <li>Winners are responsible for any taxes...</li>
                  <li>CompetitionHub will arrange delivery...</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Points System</h2>
                <p className="text-text-secondary mb-4">
                  CompetitionHub operates a loyalty points system...
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>100 points are earned for every £1 spent</li>
                  <li>10,000 points can be redeemed...</li>
                  <li>Points expire after 12 months...</li>
                  <li>Points have no cash value</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Liability</h2>
                <p className="text-text-secondary">
                  CompetitionHub accepts no liability for any loss or damage...
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
                <p className="text-text-secondary">
                  CompetitionHub reserves the right to modify these terms...
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
                <p className="text-text-secondary">
                  For questions about these terms...
                </p>
                <div className="bg-gradient-start p-4 rounded-xl mt-4">
                  <p className="text-text-secondary">Email: support@competitionhub.com</p>
                  <p className="text-text-secondary">Phone: +44 (0) 20 1234 5678</p>
                  <p className="text-text-secondary">
                    Address: CompetitionHub Ltd, 123 Competition Street, London, UK
                  </p>
                </div>
              </section>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
