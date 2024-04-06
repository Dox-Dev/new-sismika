<script lang="ts">
    import { Stepper, Step } from "@skeletonlabs/skeleton";
</script>

<style>
    div {
        margin: 1.25rem;
        border: 0.125rem solid black; 
        padding: 0.625rem; 
        border-radius: 1rem;
    }
</style>

<div>
    <Stepper>
        <Step>
            <svelte:fragment slot="header">Let's get started!</svelte:fragment>
            <p>Welcome to Sismika, the innovative seismic visualizer designed to empower you with comprehensive information about seismic events in the Philippines. Our mission is to enhance public awareness, preparedness, and resilience in a region that is no stranger to the forces of nature. Let's get started on your journey to navigating and utilizing Sismika effectively.</p>
        </Step>
        <Step>
            <svelte:fragment slot="header">Getting Started</svelte:fragment>
            <p>After logging into Sismika, you will be greeted by the dashboard. This is your central hub for accessing all features of the application. On the dashboard, you'll find the Interactive Philippine Map, the heart of Sismika, where seismic events are visually represented.</p>
        </Step>
        <Step>
            <svelte:fragment slot="header">Exploring the Interactive Map</svelte:fragment>
            <p>The Interactive Philippine Map is your gateway to visualizing seismic events. Here's how to use it</p>
            <ul>
                <li>Zoom and Navigate: Use your mouse or touchpad to zoom in and out. Navigate by clicking and dragging the map.</li>
                <li>View Event Markers: Earthquake events are marked on the map. These markers vary in size and color to indicate the magnitude and depth of the events.</li>
                <li>Access Event Details: Click on any event marker to view detailed information about the earthquake, including its magnitude, depth, affected areas, and local intensities.</li>
            </ul>
        </Step>
        <Step>
            <svelte:fragment slot="header">Filters and Search</svelte:fragment>
            <p>To refine your view of seismic events, Sismika offers filters and search capabilities:</p>
            <ul>
                <li>Location-based search: Entering the location and the distance will allow Sismika to search for earthquakes from a certain location.</li>
                <li>Date Range Selector: Earthquake events are marked on the map. These markers vary in size and color to indicate the magnitude and depth of the events.</li>
                <li>Magnitude and Depth Filters: These filters allow you to view earthquakes based on their magnitude and depth, helping you focus on events of particular interest.</li>
            </ul>
        </Step>
        <Step>
            <svelte:fragment slot="header">Research Features</svelte:fragment>
            <p>The Interactive Philippine Map is your gateway to visualizing seismic events. Here's how to use it</p>
            <ul>
                <li>Submit Posts: Researchers can submit posts for additional information on the Earthquakes.</li>
                <li>Submit Earthquake Events: Manual addition of Earthquake events can be done.</li>
            </ul>
        </Step>
    </Stepper>
</div>