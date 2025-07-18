package org.example.aayojan.Repositories;

import org.example.aayojan.Entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@ResponseBody
public interface EventRepo extends JpaRepository<Event,Integer> {
    List<Event> findByPublished(Integer publishedStatus);

}
