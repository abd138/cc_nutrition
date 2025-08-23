import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

import LoadingScreen from "../components/LoadingScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import Dashboard from "../components/Dashboard";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated but hasn't completed profile, redirect to onboarding
    if (session?.user && !session.user.hasProfile) {
      void router.push("/onboarding");
    }
  }, [session, router]);

  if (status === "loading") {
    return <LoadingScreen message="Loading your nutrition journey..." />;
  }

  if (!session) {
    return (
      <>
        <Head>
          <title>NutriTrack - Your Personal Nutrition Companion</title>
          <meta name="description" content="Track your nutrition, achieve your goals, and stay motivated with gamification. Built with BMAD methodology." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <WelcomeScreen />
      </>
    );
  }

  if (!session.user.hasProfile) {
    return <LoadingScreen message="Setting up your profile..." />;
  }

  return (
    <>
      <Head>
        <title>Dashboard - NutriTrack</title>
        <meta name="description" content="Your nutrition dashboard with daily progress and goals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard />
    </>
  );
};

export default Home;