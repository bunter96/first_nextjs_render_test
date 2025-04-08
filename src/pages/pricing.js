import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { account } from '../../appwriteConfig';

const plans = [
  {
    title: "Starter",
    monthly: "$9",
    yearly: "$90",
    frequency: "/mo",
    description: "Perfect for individuals starting out.",
    features: ["1 Project", "Basic Analytics", "Email Support"],
    cta: "Get Started",
    featured: false,
    monthlyId: "prod_3d6z0m8mKmzuV6LvPwc0jf",
    yearlyId: "prod_3hWM6T8Iu8GZsUFsyQgrnB",
  },
  {
    title: "Pro",
    monthly: "$29",
    yearly: "$290",
    frequency: "/mo",
    description: "Ideal for growing teams and businesses.",
    features: [
      "10 Projects",
      "Advanced Analytics",
      "Priority Email Support",
      "Team Collaboration",
    ],
    cta: "Upgrade Now",
    featured: true,
    monthlyId: "prod_1308g86Vz0IIqbZgpPa9o4",
    yearlyId: "prod_1B1DSJwW6nBTYgQYFsxP7",
  },
  {
    title: "Turbo",
    monthly: "$50",
    yearly: "$500",
    frequency: "/mo",
    description: "High-performance plan for scaling businesses.",
    features: [
      "Unlimited Projects",
      "Advanced Analytics",
      "24/7 Priority Support",
      "Team Collaboration",
      "Dedicated Account Manager",
    ],
    cta: "Get Turbo",
    featured: false,
    monthlyId: "prod_xNBLeAW61WSH5dmRcBxPP",
    yearlyId: "prod_23qN6cgjlpiCtD3OfY2JqH",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState(null);
  const { user } = useAuth();

  const handleSubscribe = async (plan) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Prevent resubscribing to active plan
    const planId = yearly ? plan.yearlyId : plan.monthlyId;
    if (user?.profile?.active_product_id === planId) {
      return;
    }

    setLoading(plan.title);
    try {
      const billingCycle = yearly ? 'yearly' : 'monthly';
      const fullPlanName = `${plan.title} ${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}`;

      const jwtResponse = await account.createJWT();
      const jwt = jwtResponse.jwt;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Appwrite-JWT': jwt,
        },
        body: JSON.stringify({ 
          planId, 
          billingCycle,
          fullPlanName,
        }),
      });

      const { url } = await response.json();
      if (!response.ok) throw new Error('Failed to create checkout session');

      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-10"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold mb-4"
        >
          Choose the plan that&apos;s right for you
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-8"
        >
          Whether you&apos;re just getting started or scaling your business, we&apos;ve got a plan for you.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={() => setYearly(!yearly)}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full shadow-inner transition-colors hover:bg-gray-300"
          >
            {yearly ? "Yearly Billing" : "Monthly Billing"}
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, idx) => {
            const planId = yearly ? plan.yearlyId : plan.monthlyId;
            const isSubscribed = user?.profile?.active_product_id === planId;

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`rounded-2xl shadow-lg p-8 flex flex-col items-center text-center bg-white transition-all ${
                  plan.featured ? "border-2 border-blue-500 transform scale-105" : ""
                } ${isSubscribed ? "ring-2 ring-green-500" : ""}`}
              >
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
                  {isSubscribed && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold mb-1">
                  {yearly ? plan.yearly : plan.monthly}
                  <span className="text-lg font-normal text-gray-500">{plan.frequency}</span>
                </p>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="text-left space-y-2 mb-6 w-full">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: isSubscribed ? 1 : 1.05 }}
                  whileTap={{ scale: isSubscribed ? 1 : 0.95 }}
                  onClick={() => handleSubscribe(plan)}
                  disabled={isSubscribed || loading === plan.title}
                  className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                    isSubscribed
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : plan.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {loading === plan.title ? "Loading..." : isSubscribed ? "Subscribed" : plan.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold mb-6">Compare Features</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold">Feature</th>
                  {plans.map((plan, i) => (
                    <th key={i} className="p-4 text-center font-semibold">
                      {plan.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Basic Analytics",
                  "Advanced Analytics",
                  "Team Collaboration",
                  "24/7 Priority Support",
                  "Dedicated Account Manager",
                  "Unlimited Projects",
                  "Email Support",
                  "Priority Email Support",
                  "1 Project",
                  "10 Projects",
                ].map((feature, i) => (
                  <motion.tr
                    key={i}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.05 + 0.4 }}
                    className="border-t even:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{feature}</td>
                    {plans.map((plan, j) => (
                      <td key={j} className="p-4 text-center">
                        {plan.features.includes(feature) ? (
                          <CheckCircle2 className="inline-block text-green-500 w-5 h-5" />
                        ) : (
                          "—"
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </motion.section>
  );
}
