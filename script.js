 const parkingSlots = [
            { id: 1, status: "booked", type: "car" },
            { id: 2, status: "free", type: "motorcycle" },
            { id: 3, status: "free", type: "car" },
        ];

        const parkingSlotsContainer = document.getElementById("parkingSlots");
        const bookingModal = document.getElementById("bookingModal");

       function updateParkingSlots() {
    parkingSlotsContainer.innerHTML = "";
    parkingSlots.forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = `bg-white rounded-lg shadow-md p-6 cursor-pointer transition-colors ${slot.status === "booked" ? "border-4 border-red-500" : "border-4 border-green-500"}`;
        slotDiv.onclick = () => handleSlotClick(slot);
        slotDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">Slot ${slot.id}</h3>
                <span class="px-2 py-1 rounded-full text-white text-sm ${slot.status === "booked" ? "bg-red-500" : "bg-green-500"}">
                    ${slot.status === "booked" ? "Booked" : "Free"}
                </span>
            </div>
            <div class="flex items-center mt-2">
                <span class="text-gray-500">Vehicle Type: ${slot.type}</span>
            </div>
        `;
        parkingSlotsContainer.appendChild(slotDiv);
        // Firebase listener for slot status
        database.ref(`parking_space/slot${slot.id}/status`).on("value", function(snapshot) {
            slot.status = snapshot.val();
            updateParkingSlots(); // Refresh the slots display
        });
    });
}

        function handleSlotClick(slot) {
            if (slot.status === "free") {
                bookingModal.classList.remove("hidden");
                document.getElementById("name").value = ""; // Reset name input
                document.getElementById("date").value = ""; // Reset date input
                document.getElementById("time").value = ""; // Reset time input
            }
        }

        function bookSlot() {
            const name = document.getElementById("name").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;

            const selectedSlot = parkingSlots.find(slot => slot.status === "free");
            if (selectedSlot && name && date && time) {
                selectedSlot.status = "booked";
                updateParkingSlots();
                closeModal();
            }
        }

        function closeModal() {
            bookingModal.classList.add("hidden");
        }

        let gateStatus = "closed";
        const toggleGateButton = document.getElementById("toggleGateButton");
        toggleGateButton.onclick = () => {
            gateStatus = gateStatus === "closed" ? "open" : "closed";
            toggleGateButton.innerText = gateStatus === "closed" ? "Close Gate" : "Open Gate";
        };

        // Initialize the parking slots display
        updateParkingSlots();
